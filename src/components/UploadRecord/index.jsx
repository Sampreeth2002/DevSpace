import Button from "@material-ui/core/Button"
import Paper from "@material-ui/core/Paper"
import { withStyles } from "@material-ui/core/styles"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import TextField from "@material-ui/core/TextField"
import CloudUploadIcon from "@material-ui/icons/CloudUpload"
import PropTypes from "prop-types"
import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCurrentUser } from "../../utils/currentUser.hook"
import { MedicalSystemContext } from "../App"

const CustomTableCell = withStyles(theme => ({
	head: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	body: {
		fontSize: 14,
	},
}))(TableCell)

const styles = theme => ({
	root: {
		width: "100%",
		marginTop: theme.spacing.unit * 3,
		overflowX: "auto",
	},
	table: {
		minWidth: 700,
	},
	row: {
		"&:nth-of-type(odd)": {
			backgroundColor: theme.palette.background.default,
		},
	},
	container: {
		display: "flex",
		flexWrap: "wrap",
	},
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width: 200,
	},
	rightIcon: {
		marginLeft: theme.spacing.unit,
	},
	dense: {
		marginTop: 19,
	},
	menu: {
		width: 200,
	},
})

function UploadRecord(props) {
	const navigate = useNavigate()
	const { classes } = props
	const ctx = useContext(MedicalSystemContext)
	const { loadingUser, userType, user } = useCurrentUser()
	const [readFiles, setReadFiles] = useState(null)
	const [records, setRecords] = useState([])
	const [recordName, setrecordName] = useState([])

	useEffect(() => {
		if (loadingUser) return
		if (userType !== "Patient") {
			navigate("/", { replace: true })
			return
		}

		;(async () => {
			for (let recordId = 1; recordId <= user.totalRecords; ++recordId) {
				const { ipfsHash, uploadDate, name } = await ctx.medicalSystem.methods
					.getPatientRecord(ctx.account, recordId)
					.call({ from: ctx.account })

				setRecords(rec => [...rec, { ipfsHash, uploadDate: new Date(uploadDate * 1000), name }])
			}
		})()
	}, [loadingUser, userType, user])

	const onFileCapture = event => {
		event.preventDefault()

		//Process File for IPFS
		setReadFiles([event.target.files[0]])
	}

	// Example: "QmdAZ1qp1vpw3MvVrSdYAT1M4zS2N57p1kCmz5RCFAKJ49";
	// Example Url : https://ipfs.infura.io/ipfs/....
	const onSubmitUploadRecord = async event => {
		event.preventDefault()

		let rootCid
		try {
			rootCid = await ctx.ipfsStorage.put(readFiles)
		} catch (error) {
			console.error(error)
			return
		}

		const res = await ctx.medicalSystem.methods
			.uploadPatientRecord(rootCid, recordName)
			.send({ from: ctx.account })

		const { newRecordId } = res.events.PatientRecordUploaded.returnValues

		const { ipfsHash, uploadDate, name } = await ctx.medicalSystem.methods
			.getPatientRecord(ctx.account, newRecordId)
			.call({ from: ctx.account })
		setRecords(rec => [...rec, { ipfsHash, uploadDate: new Date(uploadDate * 1000), name }])

		// Store hash(file) in blockchain
	}

	console.table(records)

	return (
		<div>
			<div className='container-fluid mt-5'>
				<div style={{ textAlign: "center" }}>
					<div>
						<form onSubmit={onSubmitUploadRecord}>
							<TextField
								required
								id='outlined-required'
								label='Enter Record Name'
								className={classes.textField}
								margin='2px'
								variant='outlined'
								style={{ marginTop: "15px", marginLeft: "15px" }}
								value={recordName}
								onChange={e => {
									setrecordName(e.target.value)
								}}
							/>
							<br />
							<br />
							<input type='file' onChange={onFileCapture} />
							<Button
								variant='contained'
								color='default'
								className={classes.button}
								startIcon={<CloudUploadIcon />}
								type='submit'
							>
								Upload
							</Button>
						</form>
					</div>
					<div style={{ marginLeft: "23vw", width: "750px" }}>
						<Paper className={classes.root}>
							<Table className={classes.table}>
								<TableHead>
									<TableRow>
										<CustomTableCell>Record Name</CustomTableCell>
										<CustomTableCell>Time of Upload</CustomTableCell>
										<CustomTableCell>Record IPFS</CustomTableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{records.map(row => (
										<TableRow className={classes.row} key={row.id}>
											<CustomTableCell component='th' scope='row'>
												{row.uploadDate.toString()}
											</CustomTableCell>
											<CustomTableCell component='th' scope='row'>
												{row.uploadDate.toString()}
											</CustomTableCell>
											<CustomTableCell>{row.ipfsHash}</CustomTableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Paper>
					</div>
				</div>
			</div>
		</div>
	)
}

UploadRecord.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(UploadRecord)

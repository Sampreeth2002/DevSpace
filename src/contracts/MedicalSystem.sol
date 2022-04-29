pragma solidity ^0.5.0;

contract MedicalSystem {
    uint public patientCount  = 0;
    uint public doctorCount = 0;
    mapping(address => Patient) public patients;
    mapping(address => Doctor) public doctors;

    constructor() public {
    }

    struct Record {
        string ipfsHash;
        string name;
        uint uploadDate;
    }

    struct Patient {
        address id;
        string name;
        uint age;

        uint totalRecords;
        mapping(uint => Record) records;
        
        mapping(address => bool) permissionsToDoctors;
    }

    event PatientCreated(
        address id,
        string name,
        uint age
    );


    event PatientRecordUploaded(
        address patientId,
        uint newRecordId,
        string name,
        uint uploadDate
    );

    event GivenPermission(
        address indexed patientId,
        address indexed doctorId
    );

    struct Doctor {
        address id;
        string name;
        string imageUrl;

        mapping(address => bool) patientsPermission;
    }

    event DoctorCreated(
        address id,
        string name,
        string imageUrl
    );

    function login() public view returns (string memory userType) {
        if (patients[msg.sender].id != address(0)) return "Patient";
        if (doctors[msg.sender].id != address(0)) return "Doctor";
        
        return "Guest";
    }


    function createPatient(string memory _name, uint  _age) public {
        if (patients[msg.sender].id != address(0)) revert("Already registered as a Patient");
        else if (doctors[msg.sender].id != address(0)) revert("Already registered as a Doctor");

        patientCount++;
        patients[msg.sender] = Patient({
            id: msg.sender,
            name: _name,
            age: _age,
            totalRecords: 0
        });

        Patient storage _patient = patients[msg.sender];
        emit PatientCreated({
            id: _patient.id,
            name: _patient.name,
            age: _patient.age
        });
    }

    function uploadPatientRecord(string memory _ipfsHash, string memory _name) public {
        require(patients[msg.sender].id != address(0), "Not a Patient");
        
        Patient storage _patient = patients[msg.sender];
        _patient.totalRecords++;
        _patient.records[_patient.totalRecords] = Record({
            ipfsHash: _ipfsHash,
            name: _name,
            uploadDate: now
        });

        emit PatientRecordUploaded({
            patientId: _patient.id,
            newRecordId: _patient.totalRecords,
            name: _name,
            uploadDate: now
        });
    }

    function getPatientRecord(address _patientId, uint _recordId) 
    public view 
    returns (string memory ipfsHash, string memory name, uint uploadDate)
    {
        require(patients[_patientId].id != address(0), "Invalid Patient ID provided");

        if(_patientId != msg.sender) {
            require(
                doctors[msg.sender].id != address(0), 
                "Sender is not a Registered Doctor"
            );
            require(
                patients[_patientId].permissionsToDoctors[msg.sender] == true, 
                "Patient has not provided permission for the Doctor"
            );
        }

        require(
            0 < _recordId && _recordId <= patients[_patientId].totalRecords,
            "Invalid Record ID provided"
        );

        Record storage _record = patients[_patientId].records[_recordId];
        return (_record.ipfsHash, _record.name, _record.uploadDate);
    }
    
    function createDoctor(
        string memory _name, 
        string memory _imageUrl
    ) public {
        if (patients[msg.sender].id != address(0)) revert("Already registered as a Patient");
        else if (doctors[msg.sender].id != address(0)) revert("Already registered as a Doctor");

        doctorCount++;
        doctors[msg.sender] = Doctor({
            id: msg.sender,
            name: _name,
            imageUrl: _imageUrl
        });

        Doctor storage _doctor = doctors[msg.sender];
        emit DoctorCreated({
            id: _doctor.id,
            name: _doctor.name,
            imageUrl: _doctor.imageUrl
        });
    }

    function givePermission(address _doctorId) public {
        require(patients[msg.sender].id != address(0), "Sender is not a Registered Patient");
        require(doctors[_doctorId].id != address(0), "Invalid Doctor ID provided");

        require(
            patients[msg.sender].permissionsToDoctors[_doctorId] == false &&
            doctors[_doctorId].patientsPermission[msg.sender] == false, 
            "Permission already granted"
        );

        //Patient Permission
        Patient storage _patient = patients[msg.sender];
        _patient.permissionsToDoctors[_doctorId] = true;

        // Doctor Permission
        Doctor storage _doctor  = doctors[_doctorId];
        _doctor.patientsPermission[msg.sender] = true;

        emit GivenPermission({
            patientId: _patient.id,
            doctorId: _doctor.id
        });
    }
}



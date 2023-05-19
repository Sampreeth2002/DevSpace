pragma solidity ^0.5.0;

contract MedicalSystem {
    uint public patientCount = 0;
    uint public doctorCount = 0;
    uint public diagnosticCentreCount = 0;
    mapping(address => Patient) public patients;
    mapping(address => Doctor) public doctors;
    mapping(address => DiagnosticCenter) public diagnosticCenter;

    constructor() public {
    }

    struct Record {
        string ipfsHash;
        string name;
        uint uploadDate;
    }



    struct Patient {
        address id;
        string first_name;
        string last_name;
        string contact_number;
        string blood_group;
        string location;
        uint age;
        uint totalRecords;
        mapping(uint => Record) records;
        
        mapping(address => bool) permissionsToDoctors;
    }

    event PatientCreated(
        address id,
        string first_name,
        string last_name,
        string contact_number,
        string blood_group,
        string location,
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
        string first_name;
        string last_name;
        string contact_number;
        string creditionals;
        string hospital;
        string department;
        string imageUrl;

        mapping(address => bool) patientsPermission;
    }

    event DoctorCreated(
        address id,
        string first_name,
        string last_name,
        string contact_number,
        string creditionals,
        string hospital,
        string department,
        string imageUrl
    );

    struct DiagnosticCenterRecord {
        address patientId;
        string ipfsHash;
        string name;
        uint uploadDate;
    }

    struct DiagnosticCenter {
        address id;
        string name;
        string location;
        uint diagnosticCenterTotalRecords;
        uint noOfPatients;
        mapping(uint => DiagnosticCenterRecord) diagnosticCenterRecords;
        mapping(uint => address) diagnosticCenterPatients;
    }

    event DiagnosticCenterCreated(
        address id,
        string name,
        string location
    );

    event DiagnosticCenterRecordUpload(
        address diagnosticCenterId,
        uint newRecordId,
        string name,
        uint uploadDate
    );

    function login() public view returns (string memory userType) {
        if (patients[msg.sender].id != address(0)) return "Patient";
        if (doctors[msg.sender].id != address(0)) return "Doctor";
        if (diagnosticCenter[msg.sender].id != address(0)) return "DiagnosticCenter";
        
        return "Guest";
    }


    function createPatient(string memory _first_name,string memory _last_name,string memory _contact_number,string memory _blood_group,string memory _location, uint  _age) public {
        if (patients[msg.sender].id != address(0)) revert("Already registered as a Patient");
        else if (doctors[msg.sender].id != address(0)) revert("Already registered as a Doctor");
        else if (diagnosticCenter[msg.sender].id != address(0)) revert("Already registered as a Diagnostic Center");


        patientCount++;
        patients[msg.sender] = Patient({
            id: msg.sender,
            first_name: _first_name,
            last_name: _last_name,
            contact_number: _contact_number,
            blood_group: _blood_group,
            location: _location,
            age: _age,
            totalRecords: 0
        });

        Patient storage _patient = patients[msg.sender];
        emit PatientCreated({
            id: _patient.id,
            first_name: _patient.first_name,
            last_name:_patient.last_name,
            contact_number:_patient.contact_number,
            blood_group:_patient.blood_group,
            location:_patient.location,
            age: _patient.age
        });
    }

    function createDiagnosticCenter(string memory _name,string memory _location) public{
        if (patients[msg.sender].id != address(0)) revert("Already registered as a Patient");
        else if (doctors[msg.sender].id != address(0)) revert("Already registered as a Doctor");
        else if (diagnosticCenter[msg.sender].id != address(0)) revert("Already registered as a Diagnostic Center");

        diagnosticCentreCount++;
        diagnosticCenter[msg.sender] = DiagnosticCenter({
            id:msg.sender,
            name:_name,
            location:_location,
            diagnosticCenterTotalRecords:0,
            noOfPatients:0
        });

        DiagnosticCenter storage _diagnosticCenter = diagnosticCenter[msg.sender];
        emit DiagnosticCenterCreated({
            id:_diagnosticCenter.id,
            name : _diagnosticCenter.name,
            location : _diagnosticCenter.location
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

    function uploadDiagnosticCenterRecord(string memory _ipfsHash, string memory _name, address _patientAddress) public {
        require(diagnosticCenter[msg.sender].id != address(0), "Not a Diagnostic Center");

        DiagnosticCenter storage _diagnosticCenter = diagnosticCenter[msg.sender];
        _diagnosticCenter.diagnosticCenterTotalRecords++;
        _diagnosticCenter.diagnosticCenterRecords[_diagnosticCenter.diagnosticCenterTotalRecords] = DiagnosticCenterRecord({
            patientId : _patientAddress,
            ipfsHash: _ipfsHash,
            name: _name,
            uploadDate: now
        });

        Patient storage _patient = patients[_patientAddress];
        _patient.totalRecords++;
        _patient.records[_patient.totalRecords] = Record({
            ipfsHash: _ipfsHash,
            name: _name,
            uploadDate: now
        });

        emit DiagnosticCenterRecordUpload({
            diagnosticCenterId:_diagnosticCenter.id,
            newRecordId : _diagnosticCenter.diagnosticCenterTotalRecords,
            name:_name,
            uploadDate : now
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
        string memory _first_name, 
        string memory _last_name, 
        string memory _contact_number, 
        string memory _creditionals,  
        string memory _hospitals, 
        string memory _department, 
        string memory _imageUrl
    ) public {
        if (patients[msg.sender].id != address(0)) revert("Already registered as a Patient");
        else if (doctors[msg.sender].id != address(0)) revert("Already registered as a Doctor");
        else if (diagnosticCenter[msg.sender].id != address(0)) revert("Already registered as a Diagnostic Center");


        doctorCount++;
        doctors[msg.sender] = Doctor({
            id: msg.sender,
            first_name: _first_name,
            last_name: _last_name,
            contact_number: _contact_number,
            creditionals: _creditionals,
            hospital: _hospitals,
            department: _department,
            imageUrl: _imageUrl
        });

        Doctor storage _doctor = doctors[msg.sender];
        emit DoctorCreated({
            id: _doctor.id,
            first_name: _doctor.first_name,
            last_name: _doctor.last_name,
            contact_number: _doctor.contact_number,
            creditionals: _doctor.creditionals,
            hospital: _doctor.hospital,
            department: _doctor.department,
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



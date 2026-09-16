// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VeriQLedger
 * @notice VeriQ — Secure Examination Paper Distribution & Blockchain-Backed Chain of Custody (WB-03)
 * @dev Anchors cryptographic proofs (SHA-256), access audits, centre/device authorizations,
 *      and lifecycle events without storing sensitive off-chain document contents.
 */
contract VeriQLedger {
    address public immutable owner;

    enum EventType {
        PAPER_CREATED,
        PAPER_APPROVED,
        PAPER_HASHED,
        PAPER_ENCRYPTED,
        PAPER_ASSIGNED,
        CENTRE_AUTHORIZED,
        DEVICE_AUTHORIZED,
        ACCESS_ATTEMPT,
        ACCESS_GRANTED,
        ACCESS_DENIED,
        PAPER_RELEASED,
        PAPER_VERIFIED,
        PAPER_REVOKED,
        INCIDENT_CREATED
    }

    struct PaperRecord {
        string paperId;
        string examId;
        bytes32 documentHash; // SHA-256 digest
        string version;
        address registeredBy;
        uint256 registeredAt;
        bool isApproved;
        bool isReleased;
        bool isRevoked;
        string revocationReason;
    }

    struct CustodyEvent {
        bytes32 eventId;
        string paperId;
        EventType eventType;
        string actorId;
        string centreId;
        string deviceId;
        bytes32 payloadHash;
        uint256 timestamp;
        bool success;
        string metadata;
    }

    // Storage Mappings
    mapping(string => PaperRecord) private papers;
    mapping(string => bool) private paperExists;
    mapping(string => CustodyEvent[]) private paperHistory;
    mapping(string => mapping(string => bool)) private authorizedCentres;
    mapping(string => mapping(string => bool)) private authorizedDevices;
    
    CustodyEvent[] private globalEvents;

    // Events
    event PaperRegistered(string indexed paperId, string indexed examId, bytes32 documentHash, address indexed registeredBy);
    event PaperApproved(string indexed paperId, string actorId, uint256 timestamp);
    event PaperAssigned(string indexed paperId, string indexed centreId, uint256 releaseTime);
    event CentreAuthorized(string indexed centreId, string examId, uint256 timestamp);
    event DeviceAuthorized(string indexed centreId, string indexed deviceId, uint256 timestamp);
    event AccessRecorded(string indexed paperId, string indexed centreId, string deviceId, bool allowed, string reason, uint256 timestamp);
    event PaperReleased(string indexed paperId, string actorId, uint256 timestamp);
    event PaperVerified(string indexed paperId, bytes32 verifiedHash, bool matchSuccess, uint256 timestamp);
    event PaperRevoked(string indexed paperId, string reason, string actorId, uint256 timestamp);
    event IncidentLogged(string indexed incidentId, string indexed paperId, string incidentType, string severity, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "VeriQ: Caller is not authorized authority");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerPaper(
        string calldata _paperId,
        string calldata _examId,
        bytes32 _documentHash,
        string calldata _version,
        string calldata _actorId
    ) external {
        require(!paperExists[_paperId], "VeriQ: Paper already registered");

        papers[_paperId] = PaperRecord({
            paperId: _paperId,
            examId: _examId,
            documentHash: _documentHash,
            version: _version,
            registeredBy: msg.sender,
            registeredAt: block.timestamp,
            isApproved: false,
            isReleased: false,
            isRevoked: false,
            revocationReason: ""
        });
        paperExists[_paperId] = true;

        _recordEvent(
            _paperId,
            EventType.PAPER_CREATED,
            _actorId,
            "",
            "",
            _documentHash,
            true,
            "Document hash registered"
        );

        emit PaperRegistered(_paperId, _examId, _documentHash, msg.sender);
    }

    function approvePaper(string calldata _paperId, string calldata _actorId) external {
        require(paperExists[_paperId], "VeriQ: Paper does not exist");
        PaperRecord storage paper = papers[_paperId];
        require(!paper.isRevoked, "VeriQ: Cannot approve revoked paper");

        paper.isApproved = true;

        _recordEvent(
            _paperId,
            EventType.PAPER_APPROVED,
            _actorId,
            "",
            "",
            paper.documentHash,
            true,
            "Security authority approval granted"
        );

        emit PaperApproved(_paperId, _actorId, block.timestamp);
    }

    function assignPaper(
        string calldata _paperId,
        string calldata _centreId,
        uint256 _releaseTime,
        string calldata _actorId
    ) external {
        require(paperExists[_paperId], "VeriQ: Paper does not exist");
        require(papers[_paperId].isApproved, "VeriQ: Paper must be approved first");

        authorizedCentres[_paperId][_centreId] = true;

        _recordEvent(
            _paperId,
            EventType.PAPER_ASSIGNED,
            _actorId,
            _centreId,
            "",
            keccak256(abi.encodePacked(_paperId, _centreId, _releaseTime)),
            true,
            "Centre assigned for scheduled distribution"
        );

        emit PaperAssigned(_paperId, _centreId, _releaseTime);
    }

    function authorizeCentre(string calldata _centreId, string calldata _examId) external onlyOwner {
        emit CentreAuthorized(_centreId, _examId, block.timestamp);
    }

    function authorizeDevice(
        string calldata _centreId,
        string calldata _deviceId
    ) external {
        authorizedDevices[_centreId][_deviceId] = true;
        emit DeviceAuthorized(_centreId, _deviceId, block.timestamp);
    }

    function recordAccess(
        string calldata _paperId,
        string calldata _centreId,
        string calldata _deviceId,
        string calldata _actorId,
        bool _allowed,
        string calldata _reason
    ) external {
        EventType eType = _allowed ? EventType.ACCESS_GRANTED : EventType.ACCESS_DENIED;

        _recordEvent(
            _paperId,
            eType,
            _actorId,
            _centreId,
            _deviceId,
            keccak256(abi.encodePacked(_actorId, _centreId, _deviceId, _reason)),
            _allowed,
            _reason
        );

        emit AccessRecorded(_paperId, _centreId, _deviceId, _allowed, _reason, block.timestamp);
    }

    function releasePaper(string calldata _paperId, string calldata _actorId) external {
        require(paperExists[_paperId], "VeriQ: Paper does not exist");
        PaperRecord storage paper = papers[_paperId];
        require(paper.isApproved, "VeriQ: Paper not approved");
        require(!paper.isRevoked, "VeriQ: Paper is revoked");

        paper.isReleased = true;

        _recordEvent(
            _paperId,
            EventType.PAPER_RELEASED,
            _actorId,
            "",
            "",
            paper.documentHash,
            true,
            "Time-locked cryptographic key release activated"
        );

        emit PaperReleased(_paperId, _actorId, block.timestamp);
    }

    function verifyPaper(
        string calldata _paperId,
        bytes32 _currentHash,
        string calldata _actorId
    ) external returns (bool isMatch) {
        require(paperExists[_paperId], "VeriQ: Paper does not exist");
        isMatch = (papers[_paperId].documentHash == _currentHash);

        _recordEvent(
            _paperId,
            EventType.PAPER_VERIFIED,
            _actorId,
            "",
            "",
            _currentHash,
            isMatch,
            isMatch ? "Integrity match confirmed" : "Hash mismatch - tampering detected"
        );

        emit PaperVerified(_paperId, _currentHash, isMatch, block.timestamp);
        return isMatch;
    }

    function revokePaper(
        string calldata _paperId,
        string calldata _reason,
        string calldata _actorId
    ) external {
        require(paperExists[_paperId], "VeriQ: Paper does not exist");
        PaperRecord storage paper = papers[_paperId];
        paper.isRevoked = true;
        paper.revocationReason = _reason;

        _recordEvent(
            _paperId,
            EventType.PAPER_REVOKED,
            _actorId,
            "",
            "",
            keccak256(abi.encodePacked(_reason)),
            false,
            _reason
        );

        emit PaperRevoked(_paperId, _reason, _actorId, block.timestamp);
    }

    function recordIncident(
        string calldata _incidentId,
        string calldata _paperId,
        string calldata _incidentType,
        string calldata _severity,
        string calldata _description,
        string calldata _actorId
    ) external {
        _recordEvent(
            _paperId,
            EventType.INCIDENT_CREATED,
            _actorId,
            "",
            "",
            keccak256(abi.encodePacked(_incidentId, _incidentType, _severity)),
            false,
            _description
        );

        emit IncidentLogged(_incidentId, _paperId, _incidentType, _severity, block.timestamp);
    }

    function getPaper(string calldata _paperId) external view returns (PaperRecord memory) {
        require(paperExists[_paperId], "VeriQ: Paper does not exist");
        return papers[_paperId];
    }

    function getPaperHistory(string calldata _paperId) external view returns (CustodyEvent[] memory) {
        return paperHistory[_paperId];
    }

    function getGlobalEventCount() external view returns (uint256) {
        return globalEvents.length;
    }

    function _recordEvent(
        string memory _paperId,
        EventType _type,
        string memory _actorId,
        string memory _centreId,
        string memory _deviceId,
        bytes32 _payloadHash,
        bool _success,
        string memory _metadata
    ) internal {
        bytes32 eventId = keccak256(
            abi.encodePacked(_paperId, _type, block.timestamp, globalEvents.length)
        );

        CustodyEvent memory evt = CustodyEvent({
            eventId: eventId,
            paperId: _paperId,
            eventType: _type,
            actorId: _actorId,
            centreId: _centreId,
            deviceId: _deviceId,
            payloadHash: _payloadHash,
            timestamp: block.timestamp,
            success: _success,
            metadata: _metadata
        });

        paperHistory[_paperId].push(evt);
        globalEvents.push(evt);
    }
}

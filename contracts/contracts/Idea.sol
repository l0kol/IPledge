// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import { IPAssetRegistry } from "../lib/protocol-core-v1/contracts/registries/IPAssetRegistry.sol";
import { ILicensingModule } from "../lib/protocol-core-v1/contracts/interfaces/modules/licensing/ILicensingModule.sol";
import { IPILicenseTemplate } from "../lib/protocol-core-v1/contracts/interfaces/modules/licensing/IPILicenseTemplate.sol";
import { PILFlavors } from "../lib/protocol-core-v1/contracts/lib/PILFlavors.sol";
import { ReentrancyGuardUpgradeable } from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

interface ISPGLicenseAttachmentWorkflows {
    struct IPMetadata {
        string title;
        string description;
        string[] creators;
        string[] tags;
        string[] contentHashes;
    }

    struct LicenseTermsData {
        uint256 mintingFee;
        uint256 commercialRevShare;
        address royaltyPolicy;
        address currencyToken;
    }

    function mintAndRegisterIpAndAttachPILTerms(
        address spgNftContract,
        address recipient,
        IPMetadata calldata ipMetadata,
        LicenseTermsData[] calldata licenseTermsData,
        bool allowDuplicates
    ) external returns (address ipId, uint256 tokenId, uint256[] memory licenseTermsIds);
}

contract ContentInvestment is ReentrancyGuardUpgradeable {
    IPAssetRegistry public immutable IP_ASSET_REGISTRY;
    ILicensingModule public immutable LICENSING_MODULE;
    IPILicenseTemplate public immutable PIL_TEMPLATE;
    address public immutable ROYALTY_POLICY_LAP;
    address public immutable WIP;
    address public immutable spgNftCollection;
    ISPGLicenseAttachmentWorkflows public immutable spg;

    constructor(
        address ipAssetRegistry,
        address licensingModule,
        address pilTemplate,
        address royaltyPolicyLAP,
        address wip,
        address _spgNftCollection,
        address spgAddress
    ) {
        IP_ASSET_REGISTRY = IPAssetRegistry(ipAssetRegistry);
        LICENSING_MODULE = ILicensingModule(licensingModule);
        PIL_TEMPLATE = IPILicenseTemplate(pilTemplate);
        ROYALTY_POLICY_LAP = royaltyPolicyLAP;
        WIP = wip;
        spgNftCollection = _spgNftCollection;
        spg = ISPGLicenseAttachmentWorkflows(spgAddress);
    }

    enum State { None, Created, Funded, Completed }

    struct Idea {
        State state;
        string description;
        address owner;
        uint128 fundsReceived;
        uint128 fundingGoal;
        address ipAssetAddress;
        uint256 ipAssetTokenId;
    }

    uint256 public ideaCount;
    mapping(uint256 => Idea) public ideas;
    mapping(uint256 => mapping(address => uint256)) public contributions;

    event IdeaCreated(
        uint256 indexed ideaId,
        address indexed owner,
        string description,
        uint256 fundingGoal,
        address ipId,
        uint256 tokenId
    );

    event Funded(
        uint256 indexed ideaId,
        address indexed investor,
        uint256 amount
    );

    event FundsCollected(
        uint256 indexed ideaId,
        address indexed owner,
        uint256 amount
    );

    function createIdea(
        string memory description,
        uint256 fundingGoal,
        ISPGLicenseAttachmentWorkflows.IPMetadata calldata ipMetadata,
        ISPGLicenseAttachmentWorkflows.LicenseTermsData[] calldata licenseTermsData
    ) external {
        require(bytes(description).length > 0, "Description required");
        require(fundingGoal > 0 && fundingGoal <= type(uint128).max, "Invalid funding goal");

        ideaCount++;

        (address ipId, uint256 tokenId, ) = spg.mintAndRegisterIpAndAttachPILTerms(
            spgNftCollection,
            msg.sender,
            ipMetadata,
            licenseTermsData,
            false
        );

        ideas[ideaCount] = Idea({
            state: State.Created,
            description: description,
            owner: msg.sender,
            fundsReceived: 0,
            fundingGoal: uint128(fundingGoal),
            ipAssetAddress: spgNftCollection,
            ipAssetTokenId: tokenId
        });

        emit IdeaCreated(ideaCount, msg.sender, description, fundingGoal, ipId, tokenId);
    }

    function fundIdea(uint256 ideaId) external payable {
        Idea storage idea = ideas[ideaId];
        require(idea.state == State.Created, "Not open for funding");
        require(msg.value > 0, "Zero value");

        idea.fundsReceived += uint128(msg.value);
        contributions[ideaId][msg.sender] += msg.value;

        if (idea.fundsReceived >= idea.fundingGoal) {
            idea.state = State.Funded;
        }

        emit Funded(ideaId, msg.sender, msg.value);
    }

    function collectFunds(uint256 ideaId) external nonReentrant {
        Idea storage idea = ideas[ideaId];
        require(msg.sender == idea.owner, "Not owner");
        require(idea.state == State.Funded, "Not funded");

        uint256 amount = idea.fundsReceived;
        idea.fundsReceived = 0;
        idea.state = State.Completed;

        payable(idea.owner).transfer(amount);
        emit FundsCollected(ideaId, idea.owner, amount);
    }

    function getIdea(uint256 ideaId) external view returns (Idea memory) {
        return ideas[ideaId];
    }
}

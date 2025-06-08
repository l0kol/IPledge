// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "../lib/protocol-core-v1/contracts/registries/IPAssetRegistry.sol";
import "../lib/protocol-core-v1/contracts/interfaces/modules/licensing/ILicensingModule.sol";
import "../lib/protocol-core-v1/contracts/interfaces/modules/licensing/IPILicenseTemplate.sol";
import "../lib/protocol-core-v1/contracts/lib/PILFlavors.sol";

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

contract ContentInvestment {
    IIPAssetRegistry public immutable IP_ASSET_REGISTRY;
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
        IP_ASSET_REGISTRY = IIPAssetRegistry(ipAssetRegistry);
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
        uint256 fundsReceived;
        uint256 fundingGoal;
        address ipAssetAddress;  // NFT contract address representing the IP Asset
        uint256 ipAssetTokenId;  // Token ID of the IP Asset NFT
    }

    uint256 public ideaCount;
    mapping(uint256 => Idea) public ideas;

    event IdeaCreated(uint256 indexed ideaId, address indexed owner, string description, uint256 fundingGoal);
    event Funded(uint256 indexed ideaId, address indexed investor, uint256 amount);
    event FundsCollected(uint256 indexed ideaId, address indexed owner, uint256 amount);

    /// @notice Create a new idea by minting an NFT, registering it as IP, and attaching license terms in one call
    function createIdea(
        string memory description,
        uint256 fundingGoal,
        ISPGLicenseAttachmentWorkflows.IPMetadata calldata ipMetadata,
        ISPGLicenseAttachmentWorkflows.LicenseTermsData[] calldata licenseTermsData
    ) external {
        ideaCount++;

        // Mint NFT, register IP Asset, attach license terms atomically via SPG
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
            fundingGoal: fundingGoal,
            ipAssetAddress: spgNftCollection,
            ipAssetTokenId: tokenId
        });

        emit IdeaCreated(ideaCount, msg.sender, description, fundingGoal);
    }

    // Fund an idea
    // TODO: Mint licence token to investors once the idea is fully funded 
    function fundIdea(uint256 ideaId) external payable {
        Idea storage idea = ideas[ideaId];
        require(idea.state == State.Created, "Idea not open for funding");
        require(msg.value > 0, "Must send funds");
        idea.fundsReceived += msg.value;

        if (idea.fundsReceived >= idea.fundingGoal) {
            idea.state = State.Funded;
        }
        emit Funded(ideaId, msg.sender, msg.value);
    }

    // Owner collects funds once funded
    function collectFunds(uint256 ideaId) external {
        Idea storage idea = ideas[ideaId];
        require(msg.sender == idea.owner, "Only owner can collect");
        require(idea.state == State.Funded, "Idea not fully funded");
        uint256 amount = idea.fundsReceived;
        idea.fundsReceived = 0;
        idea.state = State.Completed;
        payable(idea.owner).transfer(amount);
        emit FundsCollected(ideaId, idea.owner, amount);
    }
}

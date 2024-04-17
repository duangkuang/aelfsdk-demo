using AElf.Contracts.Consensus.AEDPoS;

namespace AElf.Contracts.BaccartContract
{
    // The state class is access the blockchain state
    public partial class BaccartContractState  
    {
         internal AEDPoSContractContainer.AEDPoSContractReferenceState ConsensusContract { get; set; }
    }
}
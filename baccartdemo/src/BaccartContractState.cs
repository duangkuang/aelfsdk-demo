using AElf.Sdk.CSharp.State;
using AElf.Types;
using System.Collections.Generic;

namespace AElf.Contracts.BaccartContract
{
    // The state class is access the blockchain state
    public partial class BaccartContractState : ContractState 
    {
        // A state that holds string value
        public StringState Message { get; set; }

        public BoolState Initialized { get; set; }

        public MappedState<Address, Bet> Bets { get; set; }
        public MappedState<Address, GameResult> Results { get; set; }
        public MappedState<Address, long> PlayerBalances { get; set; }
        public SingletonState<Address> House { get; set; }
        public SingletonState<long> ContractBalance { get; set; }
        public SingletonState<long> Salt { get; set; }
    }
}
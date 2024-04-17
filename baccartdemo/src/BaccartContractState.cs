using AElf.Sdk.CSharp.State;
using System;
using System.Collections.Generic;
using System.Linq;
using AElf;
using AElf.CSharp.Core;
using AElf.CSharp.Core.Extension;
using AElf.Sdk.CSharp;
using AElf.Types;
using Google.Protobuf.Collections;
using Google.Protobuf.WellKnownTypes;
using AElf.Contracts.Consensus.AEDPoS;

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
    }
}
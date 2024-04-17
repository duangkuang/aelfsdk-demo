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
    public partial class BaccartContractState  
    {
         internal AEDPoSContractContainer.AEDPoSContractReferenceState ConsensusContract { get; set; }
    }
}
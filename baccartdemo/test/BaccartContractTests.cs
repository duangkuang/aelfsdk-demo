using System.Threading.Tasks;
using Google.Protobuf.WellKnownTypes;
using Shouldly;
using Xunit;
using System;
using System.Collections.Generic;
using System.Linq;
using AElf;
using AElf.CSharp.Core;
using AElf.CSharp.Core.Extension;
using AElf.Sdk.CSharp;
using AElf.Types;
using Google.Protobuf.Collections;


namespace AElf.Contracts.BaccartContract
{
    // This class is unit test class, and it inherit TestBase. Write your unit test code inside it
    public class BaccartContractTests : TestBase
    {
        [Fact]
        public async Task Update_ShouldUpdateMessageAndFireEvent()
        {
            // Arrange
            var inputValue = "Hello, World!";
            var input = new StringValue { Value = inputValue };
            await BaccartContractStub.Constructor.SendAsync(ContractAddress);
            var updatedMessage = await BaccartContractStub.Read.CallAsync(new Empty());
            Console.WriteLine(updatedMessage);
            // Act
            // await BaccartContractStub.Update.SendAsync(input);
            await BaccartContractStub.PlaceBet.SendAsync(new Bet{
                BankerAmount = 0,
                PlayerAmount = 0,
                TieAmount = 10000000000,
                BankerPairAmount = 0,
                PlayerPairAmount = 0
            });

            await BaccartContractStub.BetAndPlay.SendAsync(new Empty());

            // var b = await BaccartContractStub.BetAndPlay.CallAsync(new Empty());
            // Console.WriteLine(b);

            // // Assert
            // var updatedMessage = await BaccartContractStub.Read.CallAsync(new Empty());
            updatedMessage.Value.ShouldBe(Base58CheckEncoding.Encode(ContractAddress.Value.ToByteArray()));
        }
    }
    
}
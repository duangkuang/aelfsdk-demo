using AElf.Cryptography.ECDSA;
using AElf.Testing.TestBase;

namespace AElf.Contracts.BaccartContract
{
    // The Module class load the context required for unit testing
    public class Module : ContractTestModule<BaccartContract>
    {
        
    }
    
    // The TestBase class inherit ContractTestBase class, it defines Stub classes and gets instances required for unit testing
    public class TestBase : ContractTestBase<Module>
    {
        // The Stub class for unit testing
        internal readonly BaccartContractContainer.BaccartContractStub BaccartContractStub;
        // A key pair that can be used to interact with the contract instance
        private ECKeyPair DefaultKeyPair => Accounts[0].KeyPair;

        public TestBase()
        {
            BaccartContractStub = GetBaccartContractContractStub(DefaultKeyPair);
        }

        private BaccartContractContainer.BaccartContractStub GetBaccartContractContractStub(ECKeyPair senderKeyPair)
        {
            return GetTester<BaccartContractContainer.BaccartContractStub>(ContractAddress, senderKeyPair);
        }
    }
    
}
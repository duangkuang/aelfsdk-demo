using AElf.Sdk.CSharp;
using AElf.Types;
using Google.Protobuf.WellKnownTypes;
using AElf.Contracts.MultiToken;
using Google.Protobuf;

namespace AElf.Contracts.BaccartContract
{
    // Contract class must inherit the base class generated from the proto file
    public class BaccartContract : BaccartContractContainer.BaccartContractBase
    {
        // A method that modifies the contract state
        public override Empty Update(StringValue input)
        {
            // Set the message value in the contract state
            State.Message.Value = input.Value;
            // Emit an event to notify listeners about something happened during the execution of this method
            Context.Fire(new UpdatedMessage
            {
                Value = input.Value
            });
            return new Empty();
        }

        // A method that read the contract state
        public override StringValue Read(Empty input)
        {
            // Retrieve the value from the state
            var value = State.House.Value;
            StringValue v = StringValue.Parser.ParseFrom(value.Value);
            //var value2 = GetRandomBytes(BytesValue.Parser.ParseFrom(Context.CurrentHeight.ToBytes()));
            //// Wrap the value in the return type
            Context.Fire(new UpdatedMessage
            {
                Value = Base58CheckEncoding.Encode(v.ToByteArray())
            });
            //Context.Fire(new UpdatedMessage
            //{
            //    Value = value2.Value.ToString()
            //});
            return new StringValue
            {
                Value = "hello world"
            };
        }

        public override Empty Initialize(Empty input)
        {
            //if (State.Initialized.Value)    
            //{
            //    return new Empty();
            //}
            //Address house = new Address { Value = ByteString.CopyFromUtf8("HLkgCtZrQ5ovScTf69EECrUp9o78eRX5ZK4hssxJ3KFw3yvsZ") };
            State.House.Value = Context.Sender;

            State.ConsensusContract.Value =
                Context.GetContractAddressByName(SmartContractConstants.ConsensusContractSystemName);

            State.Initialized.Value = true;
            return new Empty();
        }

        public override Empty DepositToContract(Empty input)
        {
            Assert(Context.Sender == State.House.Value, "Only the house can deposit.");
            // Assuming the contract has a method to keep track of its balance or just use Context.Self.Balance
            return new Empty();
        }

        public override Empty TransferTest(Empty input)
        {
           
            var tokenContractAddress = Context.GetContractAddressByName(SmartContractConstants.TokenContractSystemName);
            Context.SendInline(tokenContractAddress, "TransferFrom", new TransferFromInput
            {
                From = Context.Sender,
                To = State.House.Value,
                Symbol = "ELF",
                Amount = 500000000
            });
            return new Empty();
        }

        public override Empty PlaceBet(StringValue input)
        {
            var bet_dict = input.Value.Split(" ");
            Bet bet = new Bet();
            bet.BankerAmount = long.Parse(bet_dict[0]);
            bet.BankerAmount = long.Parse(bet_dict[1]);
            bet.BankerAmount = long.Parse(bet_dict[2]);
            bet.BankerAmount = long.Parse(bet_dict[3]);
            bet.BankerAmount = long.Parse(bet_dict[4]);
            var totalBetAmount = bet.BankerAmount + bet.PlayerAmount + bet.TieAmount + bet.BankerPairAmount + bet.PlayerPairAmount;
            // Assert(Context.Transaction.Value == totalBetAmount, "Bet amounts do not match sent value");
            State.Bets[Context.Sender] = bet;
            State.PlayerBalances[Context.Sender] += totalBetAmount;
            Context.Fire(new UpdatedMessage
            {
                Value = totalBetAmount.ToString() + "    "+ State.PlayerBalances[Context.Sender].ToString()
            });
            //Context.Fire(new UpdatedMessage
            //{
            //    Value =
            //    Context.GetContractAddressByName("eCHfp7D7TxHAMnBKJntwdJTSgL4yTYw6X2PoNM33ozT3ef3NQ").Value.ToString()
            //});
            //Context.Fire(new UpdatedMessage
            //{
            //    Value =
            //    Context.GetContractAddressByName("baccartgame").Value.ToString()
            //});

            var tokenContractAddress = Context.GetContractAddressByName(SmartContractConstants.TokenContractSystemName);
            // 调用后 提示 余额不足
            Context.SendInline(tokenContractAddress, "TransferFrom", new TransferFromInput
            {
                From = Context.Sender,
                To = State.House.Value,
                Symbol = "ELF",
                Amount = totalBetAmount
            });
            return new Empty();
        }

        public override Empty BetAndPlay(Empty input)
        {
            Assert(State.PlayerBalances[Context.Sender] != null && State.PlayerBalances[Context.Sender] > 0, "No bet placed");
            var bet = State.Bets[Context.Sender];
            var totalBetAmount = bet.BankerAmount + bet.PlayerAmount + bet.TieAmount + bet.BankerPairAmount + bet.PlayerPairAmount;
            Assert(totalBetAmount > 0 && totalBetAmount <= State.PlayerBalances[Context.Sender], "Invalid bet amount");
            // Simulating DrawCard function. Randomness needs to be handled differently in AElf.
            var gameResult = new GameResult
            {
                BankerCard1 = DrawCard(),
                BankerCard2 = DrawCard(),
                BankerCard3 = 0,
                PlayerCard1 = DrawCard(),
                PlayerCard2 = DrawCard(),
                PlayerCard3 = 0
            };

            var BankerTotal = (CalculateScore(gameResult.BankerCard1) + CalculateScore(gameResult.BankerCard2))%10;
            var PlayerTotal = (CalculateScore(gameResult.PlayerCard1) + CalculateScore(gameResult.PlayerCard2))%10;
            
            // 判断闲家是否要抽第三张
            if (PlayerTotal <= 5) {
                gameResult.PlayerCard3 = DrawCard(); // 抽牌1-13
                PlayerTotal = (PlayerTotal + CalculateScore(gameResult.PlayerCard3)) % 10;
            }

        // 判断庄家是否要抽第三张
        if ((BankerTotal <= 2) ||
            (BankerTotal == 3 && gameResult.PlayerCard3 != 8) ||
            (BankerTotal == 4 && gameResult.PlayerCard3 >= 2 && gameResult.PlayerCard3 <= 7) ||
            (BankerTotal == 5 && gameResult.PlayerCard3 >= 4 && gameResult.PlayerCard3 <= 7) ||
            (BankerTotal == 6 && gameResult.PlayerCard3 >= 6 && gameResult.PlayerCard3 <= 7)) {
            gameResult.BankerCard3 = DrawCard(); // 抽牌1-13
            BankerTotal = (BankerTotal + CalculateScore(gameResult.BankerCard3)) % 10;
        }

            // Simulating evaluateOutcome and calculatePayout. You need to implement the game logic.
            var Outcome = EvaluateOutcome(BankerTotal, PlayerTotal);
            var Payout = CalculatePayout(bet, BankerTotal, PlayerTotal,gameResult.BankerCard1,gameResult.BankerCard2,
                                        gameResult.PlayerCard1,gameResult.PlayerCard2);
            
            // Finalize payouts
            FinalizePayouts(Payout, totalBetAmount, Context.Sender);

            gameResult.Outcome = Outcome;
            gameResult.Payout = Payout;

            State.Results[Context.Sender] = gameResult;
            // Emitting an event is different in AElf and usually done by logging.
            Context.Fire(new GameOutcome
            {
                Player = Context.Sender,
                Result = gameResult
            });

            // Cleanup
            State.Bets.Remove(Context.Sender);
            State.PlayerBalances[Context.Sender] = 0;
            return new Empty();
        }


    // Calculate the score based on the card number
        private int CalculateScore(int card)
        {
            Assert(card >= 1 && card <= 13, "Invalid Card");
            
            if (card <= 9)
            {
                return card;
            }
            else
            {
                return 0;
            }
        }

     // Evaluate the game outcome based on banker and player totals
        private string EvaluateOutcome(int bankerTotal, int playerTotal)
        {
            if (bankerTotal > playerTotal)
            {
                return "Banker wins";
            }
            else if (playerTotal > bankerTotal)
            {
                return "Player wins";
            }
            else
            {
                return "Tie";
            }
        }

        private long CalculatePayout(Bet bet, long bankerTotal, long playerTotal, long bankerCard1, long bankerCard2, long playerCard1, long playerCard2)
            {
                long payout = 0;

                // Check for Pair bets
                if (bankerCard1 == bankerCard2)
                {
                    payout += bet.BankerPairAmount * 11; // Correct 11:1 payout for a pair
                }

                if (playerCard1 == playerCard2)
                {
                    payout += bet.PlayerPairAmount * 11; // Correct 11:1 payout for a pair
                }

                // Check for standard Baccarat bets
                if (bankerTotal > playerTotal)
                {
                    payout += bet.BankerAmount; // Correct 1:1 payout
                }
                else if (playerTotal > bankerTotal)
                {
                    payout += bet.PlayerAmount; // Correct 1:1 payout
                }
                else if (bankerTotal == playerTotal)
                {
                    payout += bet.TieAmount * 8; // Correct 8:1 payout for a tie
                }

                return payout;
            }

        private Empty FinalizePayouts(long payout, long totalBetAmount, Address player)
        {
            if (payout > 0)
            {
                State.PlayerBalances[player] += payout;
            }
            if (payout < totalBetAmount)
            {
                // Assuming house is capable of receiving the transaction
                var tokenContractAddress = Context.GetContractAddressByName(SmartContractConstants.TokenContractSystemName);
                Context.SendInline(tokenContractAddress, "TransferFrom", new TransferFromInput
                {
                    From = Context.Sender,
                    To = State.House.Value,
                    Symbol = "ELF",
                    Amount = payout
                });
            }
            else if (payout > totalBetAmount)
            {
                // Context.SendInline(player, payout - totalBetAmount);
                var tokenContractAddress = Context.GetContractAddressByName(SmartContractConstants.TokenContractSystemName);
                Context.SendInline(tokenContractAddress, "TransferFrom", new TransferFromInput
                {
                    From = State.House.Value,
                    To = player,
                    Symbol = "ELF",
                    Amount = payout
                });
            }
            State.PlayerBalances[player] -=  totalBetAmount; // Reset player's balance
            return new Empty();
        }

        // Withdraw balance for players
        public override Empty WithdrawBalance(Empty input)
        {
            var amount = State.PlayerBalances[Context.Sender];
            Assert(amount > 0, "No balance to withdraw");
            State.PlayerBalances[Context.Sender] = 0;
            // Context.SendInline(Context.Sender, amount);
            var tokenContractAddress = Context.GetContractAddressByName(SmartContractConstants.TokenContractSystemName);
                Context.SendInline(tokenContractAddress, "TransferFrom", new TransferFromInput
                {
                    From = State.House.Value,
                    To = Context.Sender,
                    Symbol = "ELF",
                    Amount = amount
                });;
            return new Empty();
        }
  
        // Placeholder for a more sophisticated randomness solution
        private int DrawCard()
        {
            // Randomness in blockchain is non-trivial and usually requires a secure off-chain solution or mechanism
            // For example, using a combination of block hash, transaction id and other factors
            // This is a placeholder function
            return (int)(Context.CurrentHeight % 13 + 1); // This is NOT secure or fair; just a placeholder
        }

        public override BytesValue GetRandomBytes(Empty input)
        {
            //var serializedInput = new GetRandomBytesInput();

            //serializedInput.MergeFrom(GetRandomBytesInput.Parser.ParseFrom(Context.CurrentHeight.ToBytes()));
            //var value = new Hash();
            //value.MergeFrom(serializedInput.Value);
            //var randomHashFromContext = Context.GetRandomHash(value);

            //return new BytesValue
            //{
            //    Value = serializedInput.Kind == 1
            //        ? new BytesValue { Value = randomHashFromContext.Value }.ToByteString()
            //        : new Int64Value { Value = Context.ConvertHashToInt64(randomHashFromContext, 1, 10000) }.ToByteString()
            //};
            var randomHash = State.ConsensusContract.GetRandomHash.Call(new Int64Value
            {
                Value = Context.CurrentHeight
            });
            randomHash = HashHelper.ConcatAndCompute(randomHash, Context.TransactionId);
            return randomHash.ToBytesValue();
        }
    }
    
}
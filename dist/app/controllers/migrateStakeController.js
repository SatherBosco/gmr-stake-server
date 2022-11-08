"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const TokenABI_json_1 = __importDefault(require("../contracts/TokenABI.json"));
const StakeABI_json_1 = __importDefault(require("../contracts/StakeABI.json"));
const StakeModel_1 = __importDefault(require("../models/StakeModel"));
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PUBLIC_ADDRESS = "0x64A44b7B5BcFE8b456492096962A3a015d8ed0AD";
const TOKEN_ADDRESS = "0x1b24ebbEc03298576337B1805c733cD225C8a6BC";
const STAKE_ADDRESS = "0xdB34f867d1073007eff37dA53Cb8D152f9B2b080";
class MigrateStakeController {
    migrate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { walletAddress } = req.body;
            try {
                // BUSCAR NO BANCO DE DADOS
                const stake = yield StakeModel_1.default.findOne({ wallet: walletAddress });
                if (!stake)
                    return res.status(400).send({ message: "Stake não encontrado." });
                if (stake.migrate)
                    return res.status(400).send({ message: "Stake já migrado." });
                const NODE_URL = "https://bsc-dataseed.binance.org/";
                const provider = new ethers_1.ethers.providers.JsonRpcProvider(NODE_URL);
                let wallet = new ethers_1.ethers.Wallet(PRIVATE_KEY);
                let walletSigner = wallet.connect(provider);
                let currentGasPrice = yield provider.getGasPrice();
                let gas_price = ethers_1.ethers.utils.formatEther(currentGasPrice);
                console.log(`Gas Price: ${gas_price}`);
                // CHECAR SE PODE MOVIMENTAR TOKENS
                let tokenContract = new ethers_1.ethers.Contract(TOKEN_ADDRESS, TokenABI_json_1.default, walletSigner);
                let allowace = yield tokenContract.allowance(stake.wallet, PUBLIC_ADDRESS);
                if (parseFloat(ethers_1.ethers.utils.formatEther(allowace)) < parseFloat(stake.tokens) / Math.pow(10, 18))
                    return res.status(400).send({ message: "Movimentação de tokens bloqueada." });
                // FAZER A TRANSFERENCIA DE TOKENS
                let numberOfTokens = ethers_1.ethers.utils.parseUnits(stake.tokens, 0);
                console.log(`N Tokens: ${numberOfTokens}`);
                let transferResult = yield tokenContract.transferFrom(stake.wallet, PUBLIC_ADDRESS, numberOfTokens);
                console.log(`Transfer Hash ${transferResult.hash}`);
                // CRIAR O STAKE
                let stakeContract = new ethers_1.ethers.Contract(STAKE_ADDRESS, StakeABI_json_1.default, walletSigner);
                let startedAtStake = stake.startedAt.getTime() / 1000;
                let endAtStake = startedAtStake + 31536000;
                console.log(`Stake Hash: ${stakeContract.hash}`);
                let stakeResult = yield stakeContract.addCustomStake(stake.wallet, startedAtStake, endAtStake, numberOfTokens);
                stake.migrate = true;
                stake.gasPrice = gas_price.toString();
                stake.transferTransactHash = transferResult.hash;
                stake.stakeTransactHash = stakeResult.hash;
                yield stake.save();
                return res.send({ message: "Migração concluida com sucesso." });
            }
            catch (error) {
                console.log(`Erro: ${error}`);
                return res.status(400).send({ message: "Falha na migração do stake" });
            }
        });
    }
}
exports.default = new MigrateStakeController();

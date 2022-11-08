import { Request, Response } from "express";
import { ethers } from "ethers";
import TokenContract from "../contracts/TokenABI.json";
import StakeContract from "../contracts/StakeABI.json";
import StakeModel from "../models/StakeModel";

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PUBLIC_ADDRESS = "0x64A44b7B5BcFE8b456492096962A3a015d8ed0AD";
const TOKEN_ADDRESS = "0x1b24ebbEc03298576337B1805c733cD225C8a6BC";
const STAKE_ADDRESS = "0xdB34f867d1073007eff37dA53Cb8D152f9B2b080";

class MigrateStakeController {
    public async migrate(req: Request, res: Response) {
        const { walletAddress } = req.body;

        try {
            // BUSCAR NO BANCO DE DADOS
            const stake = await StakeModel.findOne({ wallet: walletAddress });
            if (!stake) return res.status(400).send({ message: "Stake não encontrado." });
            if (stake.migrate) return res.status(400).send({ message: "Stake já migrado." });

            const NODE_URL = "https://bsc-dataseed.binance.org/";
            const provider = new ethers.providers.JsonRpcProvider(NODE_URL);
            let wallet = new ethers.Wallet(PRIVATE_KEY!);
            let walletSigner = wallet.connect(provider);

            let currentGasPrice = await provider.getGasPrice();
            let gas_price = ethers.utils.formatEther(currentGasPrice);
            console.log(`Gas Price: ${gas_price}`);
            // CHECAR SE PODE MOVIMENTAR TOKENS
            let tokenContract = new ethers.Contract(TOKEN_ADDRESS, TokenContract, walletSigner);
            let allowace = await tokenContract.allowance(stake.wallet, PUBLIC_ADDRESS);
            if (parseFloat(ethers.utils.formatEther(allowace)) < parseFloat(stake.tokens) / Math.pow(10, 18)) return res.status(400).send({ message: "Movimentação de tokens bloqueada." });

            // FAZER A TRANSFERENCIA DE TOKENS
            let numberOfTokens = ethers.utils.parseUnits(stake.tokens, 0);
            console.log(`N Tokens: ${numberOfTokens}`);
            let transferResult = await tokenContract.transferFrom(stake.wallet, PUBLIC_ADDRESS, numberOfTokens);
            console.log(`Transfer Hash ${transferResult.hash}`);

            // CRIAR O STAKE
            let stakeContract = new ethers.Contract(STAKE_ADDRESS, StakeContract, walletSigner);
            let startedAtStake = stake.startedAt.getTime() / 1000;
            let endAtStake = startedAtStake + 31536000;
            console.log(`Stake Hash: ${stakeContract.hash}`);

            let stakeResult = await stakeContract.addCustomStake(stake.wallet, startedAtStake, endAtStake, numberOfTokens);

            stake.migrate = true;
            stake.gasPrice = gas_price.toString();
            stake.transferTransactHash = transferResult.hash;
            stake.stakeTransactHash = stakeResult.hash;
            await stake.save();

            return res.send({ message: "Migração concluida com sucesso." });
        } catch (error) {
            console.log(`Erro: ${error}`);
            return res.status(400).send({ message: "Falha na migração do stake" });
        }
    }
}

export default new MigrateStakeController();

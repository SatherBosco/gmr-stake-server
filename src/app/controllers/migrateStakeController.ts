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
            let allowace = await tokenContract.allowance(stake.wallet.toLowerCase(), PUBLIC_ADDRESS);
            if (parseFloat(ethers.utils.formatEther(allowace)) < parseFloat(stake.tokens) / Math.pow(10, 18)) return res.status(400).send({ message: "Movimentação de tokens bloqueada." });

            // FAZER A TRANSFERENCIA DE TOKENS
            let numberOfTokens = ethers.utils.parseUnits(stake.tokens, 0);
            console.log(`N Tokens: ${numberOfTokens}`);
            let transferResult = await tokenContract.transferFrom(stake.wallet.toLowerCase(), PUBLIC_ADDRESS, numberOfTokens);
            console.log(`Transfer Hash ${transferResult.hash}`);

            // CRIAR O STAKE
            let stakeContract = new ethers.Contract(STAKE_ADDRESS, StakeContract, walletSigner);
            let startedAtStake = Math.trunc(stake.startedAt.getTime() / 1000);
            let endAtStake = startedAtStake + 31536000;

            let stakeResult = await stakeContract.addCustomStake(stake.wallet.toLowerCase(), startedAtStake, endAtStake, numberOfTokens);
            console.log(`Stake Hash: ${stakeResult.hash}`);

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

    public async create(req: Request, res: Response) {
        try {
            const address = [
                "0xec0a0db2b22ed2da87e0e6ed9c87668e8757b32b",
                "0x09cb3d4511062c48279a16a707efd07653b3e60d",
                "0xc1e1d86b7e74fa95cd517c32356408dad247a5ef",
                "0x7a5a50f5341fa1eda249f61d6ce3b8bff70b428e",
                "0x59f76f44a0aba3c1c152917a7458f482cad21591",
                "0x0f58afb4407c9688cd2398bc878407ae60584d2c",
                "0x4a1462334fb9c3bfd586e976d5feb848d8efcdf5",
                "0x9d772a0436dcc222df32e5cbb05b230619dff09d",
                "0x27544e72d975affa7705994f7c30e74238e3dbc4",
                "0x6bfb716ae2418cdce4aa6c6c558ed63957bd872d",
                "0x0ad64597bf0c6212fc1cf3f198c914cdbf28c711",
                "0x0d0fe28ece420a6b88d3c64802f1420ad2e3df41",
                "0x3c94a5f0c301875d71db01c3a1a156ce76318376",
                "0x157cca0bda3bfb0b762300b946d594ae684d981f",
                "0xcb5cf1f23d9877ae6dab033f03fc3329cf61b0d6",
                "0xa3b695d912750066172e5085948b481e56895ccf",
                "0x2718377f8ef08385861fe9c68706bd354cf9aac3",
                "0xb6d16c17a90f50c4438644ce0ead75e19bcc0554",
                "0xcb148d3c02e8ae67d8502bd7b52a3534ce8fce21",
                "0x399d8721f2be35d765cd31c0a24f65ede3572616",
                "0xd65f49ebc194168e7cb3ade3ca723cc7d3e35626",
                "0x248b579b7c3fab6e0f81acbae33f8fef8f8b56df",
                "0xeb85679cdf6182f3531e6bd260acaabc84945837",
                "0x985728c6d2884cbca5f6eb9be15be376baf3baf1",
                "0xfc8213327b574d8b00ba4101e2a31cd33965650d",
                "0x25fc90710dea0ccdf790ca9bb1cdcb5238b86511",
                "0x75e53cb33d6a41582f76206b8defefe81e755812",
                "0xe4a0d55a2523fa580d45edb8524c91d9d75c338f",
                "0xee3d488bb79857422717ee298e90f633070f9221",
                "0x1341ed70a9e48dd646c60aab8a6213117ccbd95e",
                "0x5c5553919dc8e4d39abb2efa7188be0909a83ea7",
                "0x12a5a73fab370c2bad006c20a80ec6e721444584",
                "0x2d9623bf633a2a23a3b336e4690b1d485010bd6b",
                "0xa5c92b815ce83c02e66c77413e563f4533d66800",
                "0xc8537d11f606e94228b5ccd36c23eec80d02afdb",
                "0x943c6183a5310ae1c998b71a603ef75fede0eb25",
                "0x2420a6c0946fd2a62175d8c75adf29039dedb71a",
                "0x149a4cd0af6be9f6472a08473a5d50730d695e68",
                "0xe5cb993021b62820003abfc8af209353c5cb9744",
                "0x6f79cbc59e5d80f785e7de2a708568a47a70989b",
                "0x6896e04cb987e855621cf0f2ef2e2ba2f5d4c98f",
                "0xda4e7fce357e1ebefa457b38405db64866cb1dfe",
                "0xdd089f027dacc6bdeb11dece440151cc0ef55b9a",
                "0xdf59e001d7dd04e4675c3003a4d71f2a501d8294",
                "0x206d149c170f19e7d0fad99b32a81d2e6690a72f",
                "0x784bb5d0cad9c3c48fcf162cf40254aae6b0db96",
                "0x901a8040f06f17163cd4a78f221181c609233cc1",
                "0x663b1dd9a35cec18dfeeab73009cf928afbaadba",
                "0x4588e09bbd4a764a49b2e5be67a43209a4e5ba25",
                "0x63bbfda0a9691fa86ab35c21e8db5e5f4e2f2adc",
                "0x367f2bc2999b07ee3e95f3974236942c39e12866",
                "0x3507e534d981b37374b387c2726cc996d632236a",
                "0xaf667e771b9c02679f78fc8bd9cf871efd3706ef",
                "0x2d20be6b0ed07b61c46c029f3a3b0091aa531e9e",
                "0xbb7952327e76c6f373b3d7fd88b3fdf9c40d11e3",
            ];
            const tokens = [
                "560000000000000000000",
                "50000000000000000000",
                "476000000000000000000",
                "138000000000000000000",
                "100000000000000000000",
                "556000000000000000000",
                "60,17000000000000000000",
                "207000000000000000000",
                "585,121000000000000000000",
                "165000000000000000000",
                "200000000000000000000",
                "50000000000000000000",
                "100000000000000000000",
                "50000000000000000000",
                "19825000000000000000000",
                "71000000000000000000",
                "165000000000000000000",
                "31425000000000000000000",
                "1700000000000000000000000",
                "67000000000000000000",
                "86000000000000000000",
                "543000000000000000000",
                "282000000000000000000",
                "101363000000000000000000",
                "50000000000000000000",
                "552000000000000000000",
                "1588000000000000000000",
                "517000000000000000000",
                "57000000000000000000",
                "55000000000000000000",
                "118000000000000000000",
                "112000000000000000000",
                "11035000000000000000000",
                "14147000000000000000000",
                "36715000000000000000000",
                "14848000000000000000000",
                "54000000000000000000",
                "823000000000000000000",
                "50000000000000000000",
                "700000000000000000000",
                "140000000000000000000000",
                "70000000000000000000000",
                "39140000000000000000000",
                "16303000000000000000000",
                "258055000000000000000000",
                "2021000000000000000000",
                "552000000000000000000",
                "20999000000000000000000",
                "66812000000000000000000",
                "34715000000000000000000",
                "3267000000000000000000",
                "11547000000000000000000",
                "35265000000000000000000",
                "200000000000000000000",
                "10321000000000000000000",
            ];
            const timestamp = [
                1659711720, 1659712020, 1659714000, 1659714060, 1659714060, 1659714840, 1659715080, 1659716580, 1659720540, 1659721740, 1659723120, 1659728760, 1659732300, 1659748920, 1659777540,
                1659875760, 1659977520, 1660067580, 1660070160, 1660125840, 1660266660, 1660272480, 1660368240, 1660574280, 1660586160, 1660662480, 1660748100, 1660788300, 1660829340, 1660906800,
                1660925460, 1660940220, 1661280120, 1661280180, 1661389320, 1661807280, 1661817000, 1661817240, 1661817300, 1661818320, 1662157140, 1663006260, 1663087260, 1664320920, 1664563080,
                1665014160, 1665262680, 1665428760, 1665500520, 1665676080, 1665677940, 1665848340, 1666123320, 1666306920, 1667305260,
            ];

            // for (let index = 0; index < address.length; index++) {
            //     var data = {
            //         wallet: address[index],
            //         tokens: tokens[index],
            //         startedAt: new Date(timestamp[index] * 1000),
            //     };
            //     await StakeModel.create(data);
            // }
            // var data = {
            //     wallet: "0x72f6cb158de7b9c773ed0cf73084cf9a0f3bf0ca",
            //     tokens: "50000000000000000000",
            //     startedAt: Date.now(),
            // };
            // await StakeModel.create(data);
            // const NODE_URL = "https://bsc-dataseed.binance.org/";
            // const provider = new ethers.providers.JsonRpcProvider(NODE_URL);
            // let wallet = new ethers.Wallet(PRIVATE_KEY!);
            // let walletSigner = wallet.connect(provider);
            // let stakeContract = new ethers.Contract(STAKE_ADDRESS, StakeContract, walletSigner);
            // let startedAtStake = Math.trunc(1660574280);
            // let endAtStake = startedAtStake + 31536000;

            // let stakeResult = await stakeContract.addCustomStake("0x985728c6d2884cbca5f6eb9be15be376baf3baf1", startedAtStake, endAtStake, "101363000000000000000000");
            // console.log(`Stake Hash: ${stakeContract.hash}`);

            return res.status(200).send({ message: "Ok" });
        } catch {
            return res.status(400).send({ message: "Falha na migração do stake" });
        }
    }
}

export default new MigrateStakeController();

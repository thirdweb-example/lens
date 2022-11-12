import {Component} from "react";
import Select from "../../ui/Select";
import Profile from "../../../types/Profile";
import {useContract, useTokenBalance} from "@thirdweb-dev/react";

type Props = {
    address: string,
    winner: Profile | undefined,
    label: string,
    currencies: any
}

type Stat = {
    selectedCurrency: any,
    amount: number,
    balance: any,
    valid: boolean,
    selected: any
}

export default class BestModule extends Component<Props, Stat> {
    constructor(props: Props) {
        super(props);
        this.state = {
            selectedCurrency: null,
            amount: 0,
            balance: '',
            valid: true,
            selected: false
        }
    }

    handleCurrencySelected = async (currency: any) => {
        this.setState({ selectedCurrency: currency })
        const balance = await this.getBalance(currency, this.props.address)
        this.setState( { balance: balance })
        this.validate(this.state.amount, balance)
    }

    handleAmountChange = (e: any) => {
        this.setState( { amount: e.target.value })
        this.validate(e.target.value, this.state.balance)
    }

    validate = (value: any, balance: any) => {
        if (this.state.selectedCurrency !== null) {
            if (value > balance) {
                this.setState({ valid: false })
            } else {
                this.setState({ valid: true })
            }
        }
    }

    getBalance = async (currency: any, address: string) => {
        // const provider = new providers.Web3Provider(window.ethereum);
        // const signer = provider.getSigner()
        // const tokenContract = new ethers.Contract(currency.address, ABI, provider)
        // const contractWithSigner = await tokenContract.connect(signer)
        // const res = await contractWithSigner.balanceOf(address)
        // const ethRes = ethers.utils.formatEther(res)
        // const balance = Number.parseFloat(ethRes).toFixed(6)
        // return balance.toString().replace('.000000', '')
    }

    send = async (to: string | undefined, amount: number, currency: any) => {
        // const provider = new providers.Web3Provider(window.ethereum);
        // const signer = provider.getSigner()
        // const tokenContract = new ethers.Contract(currency.address, ABI, provider)
//
        // const parsedAmount = ethers.utils.parseUnits(amount, currency.decimals)
        // const contractWithSigner = await tokenContract.connect(signer)
//
        // try {
        //     let tx = await contractWithSigner.transfer(to, parsedAmount)
        //     await tx.wait()
        // } catch (e) {
        //     console.log(e)
        // }
    }

    handleSend = async () => {
        await this.send(this.props.winner?.ownedBy, this.state.amount, this.state.selectedCurrency)
    }

    render() {
        if (!this.props.winner) {
            return (
                <div>No { this.props.label }</div>
            )
        }
        return (
            <div>
                <div className="flex flex-col my-4 gap-4">
                    <div className="z-20">
                        <div className="form-control font-semibold">Currency</div>
                        <div className="block -z-10">
                            { this.state.selected?.name }
                            <Select
                                list={this.props.currencies}
                                selected={this.state.selectedCurrency}
                                onSelect={this.handleCurrencySelected}
                            />
                        </div>
                    </div>
                    <div>
                        <div>
                            <div className="flex items-center justify-between">
                                <div>Amount</div>
                                <div className="font-thin text-gray-500">Balance : {this.state.balance}</div>
                            </div>
                        </div>
                        <input type='number' className="input" onChange={this.handleAmountChange} />
                    </div>
                </div>
                <div className="flex mt-4 z-10">
                    {
                        this.state.valid && (
                            <button className="w-auto sm:w-full btn btn-success" onClick={this.handleSend}>Giveaway</button>
                        )
                    }
                </div>
            </div>
        )
    }
}

import React from "react"

class SetSmartContract extends React.Component {
    state = { stackId: null };

    handleKeyDown2 = e => {
        if (e.keyCode === 13) {
            this.setValue(e.target.value2);
        }
    };

    setValue = (value2) => {
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.SmartContract;

        console.log(drizzle)
        const stackId = contract.methods["sendAmount"].cacheSend(drizzleState.accounts[0], this.textInput2.value, {
            from: drizzleState.accounts[0]
        });

        console.log(stackId)
        this.setState({ stackId });
    }

    getTxStatus = () => {
        const { transactions, transactionStack } = this.props.drizzleState;
        const txHash = transactionStack[this.state.stackId];
        if (!txHash) return null;
        return `Transaction status: ${transactions[txHash].status}`;
    }

    render() {
        return (
            <div>
                Envoyer : <input type="number" ref={(input2) => this.textInput2 = input2} onKeyDown={this.handleKeyDown2} />
                <div>status: [{this.getTxStatus()}]</div>
            </div>
        )
    }
}

export default SetSmartContract;
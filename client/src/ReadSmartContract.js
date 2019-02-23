import React from "react";

class ReadSmartContract extends React.Component {
    state = { dataKey: null };

    componentDidMount() {
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.SmartContract;
        var dataKey = contract.methods["totalSupply"].cacheCall();
        this.setState({ dataKey });
    }

    render() {
        const { SmartContract } = this.props.drizzleState.contracts;

        const totalSupply = SmartContract.totalSupply[this.state.dataKey];
        return (
            <div>
                Total Supply: {totalSupply && totalSupply.value}
            </div>
        )
    }
}

export default ReadSmartContract;
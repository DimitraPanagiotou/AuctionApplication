import React, { Component } from "react";
import AuctionContract from "./contracts/Auction.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { 
  	web3: null, 
  	accounts: null, 
  	contract: null,
  	bid_value: 0,
  	highest_bid: 0,
  	contract_balance: 0,
  	highest_bidder: null,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AuctionContract.networks[networkId];
      const instance = new web3.eth.Contract(
        AuctionContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  bid = async () => {
  
	try {
    	  const { accounts, contract } = this.state;

    	  // Bid from accounts[0]
    	  await contract.methods.bid().send({ from: accounts[0] , value: this.state.bid_value});
	} catch (error) {
	  alert(
             `Failed to bid. Check console for details.`,
          );
          console.error(error);
	}
  };
  
  get_contract_Balance = async () => {
    const contract = this.state.contract;
    const web3 = this.state.web3;
    
    // Get the value from the contract to prove it worked.
    const response = await contract.methods.getContractBalance().call();;

    // Update state with the result.
    
    this.setState({ contract_balance: response });
  };
  
  
  withdraw = async () => {
  
	try {
    	  const { accounts, contract } = this.state;

    	  // Bid from accounts[0]
    	  await contract.methods.withdraw().send({ from: accounts[0] });
	} catch (error) {
	  alert(
             `Failed to withdraw. Check console for details.`,
          );
          console.error(error);
	}
  };
  
  get_highestBid = async () => {
    const contract = this.state.contract;

    
    // Get the value from the contract to prove it worked.
    const response = await contract.methods.highestBid().call();

    // Update state with the result.
    this.setState({ highest_bid: response });
  };
  
  get_highestBidder = async () => {
    const contract = this.state.contract;

    
    // Get the value from the contract to prove it worked.
    const response = await contract.methods.highestBidder().call();

    // Update state with the result.
    this.setState({ highest_bidder: response });
  };
  
  handleChange = (event) => {    
  	this.setState({bid_value: event.target.value}, () => {
  	  console.log(this.state.bid_value)
  	});  
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <h2>Smart Contract Example</h2>
        <p>
          Make your offer
        </p>
        <input type="text" onChange={this.handleChange} />
        <button onClick = {this.bid}>Bid</button>
        <div>Bid value is: {this.state.bid_value}</div>
        <p>
          Withdraw
        </p>
        <button onClick = {this.withdraw}> Withdraw </button>
        <> </>
        <p>
          Other functionalities
        </p>
        <button onClick = {this.get_highestBid}>Get Highest Bid</button>
        <div>Highest bid is: {this.state.highest_bid}</div>
        <> </>
        <button onClick = {this.get_highestBidder}>Get Highest Bidder</button>
        <div>Highest bidder is: {this.state.highest_bidder}</div>
        <> 
        </>
        <button onClick = {this.get_contract_Balance}>Get Contract Balance</button>
        <div>Contract balance is: {this.state.contract_balance}</div>
      </div>
    );
  }
}

export default App;

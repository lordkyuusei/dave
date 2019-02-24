pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract DAVE is Ownable {
  enum  State { Proposed, Validated, Refused }

  uint numMembers = 0;
  mapping (address => bool) members;
  struct  Law {
    string lawHash;
    bool  voteOpen;
    State lawState;
    address[] addrPool;
    mapping (address => bool) votePool;
  }
  uint numLaw = 0;
  mapping (uint => Law) lawList;

  modifier onlyMembers {
    require(members[msg.sender]);
    _;
  }

  modifier checkProposal(uint id) {
    require(lawList[id].lawState == State.Proposed);
    _;
  }

  function modifyState(uint id, State value) private {
    lawList[id].lawState = value;
  }

  function wrapVote(uint id) private view returns (bool res) {
    Law storage elem  = lawList[id];
    uint y    = 0;
    uint n    = 0;
    uint u    = numMembers - elem.addrPool.length;

    for (uint i = 0; i < elem.addrPool.length; i++) {
      if (elem.votePool[elem.addrPool[i]] == true) {
        y++;
      } else {
        n++;
      }
    }
    if (y >= n + u) {
      res = true;
    } else {
      res = false;
    }
  }

  function addVote(uint id, address user, bool res) private {
    lawList[id].addrPool.push(user);
    lawList[id].votePool[user] = res;
  }

  function addMember(address user) public onlyOwner {
    members[user] = true;
    numMembers++;
  }

  function revMember(address user) public onlyOwner {
    delete members[user];
    numMembers--;
  }

  function addProposal(string memory text) public onlyMembers {
    lawList[numLaw++] = Law(text, false, State.Proposed, new address[](0));
  }

  function revProposal(uint id) public onlyMembers checkProposal(id) {
    delete lawList[id];
  }

  function openVote(uint id) public onlyMembers checkProposal(id) {
    require(lawList[id].voteOpen == false);

    lawList[id].voteOpen = true;
  }

  function closeVote(uint id) public onlyMembers checkProposal(id) {
    require(lawList[id].voteOpen == true);

    if (wrapVote(id)) {
      lawList[id].lawState = State.Validated;
    } else {
      lawList[id].lawState = State.Refused;
    }
    lawList[id].voteOpen = false;
  }

  function vote(uint id, bool res) public onlyMembers checkProposal(id) {
    require(!(lawList[id].votePool[msg.sender]));

    addVote(id, msg.sender, res);
  }
}

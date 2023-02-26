pragma solidity ^0.8.0;

contract Voting {
    struct Voter {
        uint256 age;
        bytes32 nationality;
        bool voted;
        uint256 vote;
    }
    struct Proposal {
        bytes32 name;
        uint256 voteCount;
    }

    address public owner;
    mapping(address => Voter) public voters;
    Proposal[] public proposals;

    constructor() public {
        owner = msg.sender;
    }

    function giveRightToVote(address voter, uint256 age, bytes32 nationality) public {
        require(msg.sender == owner, "Only owner can give right to vote.");
        require(voters[voter].voted == false, "The voter has already voted.");
        require(voters[voter].age >= 18, "The voter must be at least 18 years old.");
        require(voters[voter].nationality == "CountryName", "The voter must be a citizen of CountryName.");

        voters[voter].age = age;
        voters[voter].nationality = nationality;
        voters[voter].weight = 1;
    }

    function vote(uint256 proposal) public {
        Voter storage voter = voters[msg.sender];
        require(voter.voted == false, "The voter has already voted.");
        require(proposal <= proposals.length, "Invalid proposal.");

        voter.vote = proposal;
        voter.voted = true;
        proposals[proposal].voteCount += voter.weight;

        // Call the tallyVotes function to update the vote tally in the remote database
        tallyVotes(proposal);
    }
    function tallyVotes(uint256 proposal) private {
    // Connect to the remote MySQL database using a database driver library, such as the MySQL Connector for Node.js
    const mysql = require('mysql2');
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'user',
        password: 'password',
        database: 'database'
    });
    
    // Update the vote tally for the selected proposal in the remote database
    connection.query(
        'UPDATE proposals SET vote_count = vote_count + 1 WHERE id = ?',
        [proposal],
        function (error, results) {
            if (error) {
                console.error(error);
            } else {
                console.log('Successfully updated vote tally in remote database.');
            }
        }
    );

    // Close the database connection
    connection.end();
}

    
       
    }
}





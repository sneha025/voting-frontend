import React, { useEffect, useState } from "react";
import Friends from "./assets/Friends.jpg";
import { ethers } from "ethers";
import HIMYM from "./assets/HMYM.jpg";
import abi from "./utils/votingPortal.json";
import Swal from "sweetalert2";
function App() {
  const [currentUser, SetCurrentUser] = useState("");
  const [winner, setWinner] = useState("");
  const contractAddress = "0x800d5c2BD0aB447ceC839Dc22A14ddA6751b8879";
  const contractABI = abi.abi;
  // call the voting method from the contrat

  // checking wheather Wallet is connected
  const checkWalletConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("make sure you have metamask !");
      } else {
        console.log("yoohooo!! we are connected to metamask", ethereum);
      }

      /*
  check is we are authorize to access the user's wallet
   */
      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log(accounts); //it will be the array==> you may have more than one account in your wallet
      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("found an authorized account:", account);
      } else {
        console.log(
          "no authorized account found, connecct to your wallet first please"
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkWalletConnected();
  }, []);
  const handleVoteHIMYM = async () => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      /*
      let's connect with our contract
      */
      const votePortal = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      // call  the transaction method--> setVotingTwo
      try {
        const voteTxn = await votePortal.setVotingTwo();
        console.log("minning.....", voteTxn.hash);
        await voteTxn.wait();
      } catch (err) {
        console.log(err.message);
        Swal.fire({
          title: `There error in transaction
          ${err.message}`,

          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
        });
      }
    } else {
      console.log("connect to your wallet before any transaction");
    }
  };
  const handleVoteFrnd = async () => {
    console.log("hellow world");
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      /*
      let's connect with our contract
      */
      const votePortal = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      console.log(votePortal);
      // call  the transaction method--> setVotingTwo
      try {
        console.log("***********");
        const voteTxn = await votePortal.setVotingOne();
        console.log("minning.....", voteTxn.hash);
        await voteTxn.wait();
        console.log("mined...", voteTxn.hash);
        console.log("%%%%%%%%%%");
      } catch (err) {
        Swal.fire({
          title: `There error in transaction
          ${err.message}`,

          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
        });
      }
    } else {
      console.log("connect to your wallet before any transaction");
    }
  };
  const handleConnectWallet = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        // requesting for account and connecting with wallet
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("connected with account:", accounts[0]);
        SetCurrentUser(accounts[0]);
      } else {
        console.log("Connect to your wallet!");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const winnerDisplay = async () => {
    /*
 get the total vote from contract
 */
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      /*
      let's connect with our contract
      */
      const votePortal = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      let voteCountFrnd = await votePortal.getVotingOne();
      console.log("initial voting count for Friends", voteCountFrnd.toNumber());
      let voteCountHIMYM = await votePortal.getVotingTwo();
      console.log(
        "initial voting count for How I met your mother",
        voteCountHIMYM.toNumber()
      );

      const date = new Date();
      let day = date.getDate();
      let month = date.getMonth();
      if (day === 1 && month === 0) {
        if (voteCountFrnd > voteCountHIMYM) {
          setWinner("Friends");
        } else {
          setWinner("How I Met Your Mother");
        }
      }
    }
  };
  winnerDisplay();
  return (
    <div className="bg-gray-900 h-screen w-screen">
      <div className=" flex flex-col">
        <div>
          {!winner && (
          <h1 className="flex justify-center p-12 text-yellow-600 text-4xl">
            Namaste 🙏, Welcome to the voting portal! Vote your favourite TV
            series.
          </h1>
          )}
          {winner && Swal.fire("The Winner is"`${winner}`)}
          {!currentUser && (
          <div className="flex justify-center">
            <button
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
              onClick={handleConnectWallet}
            >
              Connect with Wallet
            </button>
          </div>
          )}
          {currentUser && (
          <div className="flex justify-center">
            <div className="flex flex-col justify-center">
              <h2 className="flex justify-center text-yellow-500 text-2xl">
                Friends
              </h2>
              <img
                src={Friends}
                className="object-contain h-56 w-full m-4 p-4"
                alt="Frnds"
              />
              <div className="flex justify-center">
                <button
                  className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                  onClick={handleVoteFrnd}
                >
                  Vote Me!
                </button>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="flex justify-center text-yellow-500 text-2xl">
                How I Met Your Mother
              </h2>
              <img
                src={HIMYM}
                className="object-contain h-56 w-full m-4 p-4"
                alt="HIMYM"
              />
              <div className=" flex justify-center">
                <button
                  className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                  onClick={handleVoteHIMYM}
                >
                  Vote Me!
                </button>
              </div>
            </div>
          </div>
          )}
        </div>

        <div className="flex justify-center  text-yellow-500 mt-28 ">
          developed by @sneha
        </div>
      </div>
    </div>
  );
}

export default App;

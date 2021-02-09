import { useEffect } from "react";
import detectEthereumProvider, { loadContractInstance } from "./utils/loadWeb3";
import studentRecordAbi from "./abis/StudentRecord.json";

const App = () => {
  const studentRecordAddress = "0x073f08c200344c311a6375f0b858a6ceea2ac3ab";
  const loadWeb3Func = () => {
    detectEthereumProvider()
      .then(() => {
        console.log("done");
        loadContractInstance(studentRecordAbi.abi, studentRecordAddress)
          .then((contract) => {
            console.log("contract instance created");
            console.log(contract);
            //send an transaction
            contract
              .addStrudent("Ravi", "Bsc")
              .then((tx) => {
                console.log("Response:", tx);
                //let's wait for confirmation of transaction
                tx.wait().then((res) => {
                  console.log("Tx confirmed");
                });
              })
              .catch((err) => {
                console.error(err);
              });
          })
          .catch((err) => {
            console.log(err);
            console.log("Error:Contract instance not created");
          });
      })
      .catch((err) => {
        console.log(err);
        console.log("Error while loading web3");
      });
  };
  useEffect(() => {
    loadWeb3Func();
  }, []);
  return (
    <div className="App">
      <header className="App-header">App loaded</header>
    </div>
  );
};

export default App;

// const UserBudget: React.FC = () => {
//   const [currentBudget, setCurrentBudget] = useState("0");
//   const changeBudget = (event: any) => {
//     const budgetSelected = event.target.value;
//     setCurrentBudget(budgetSelected);
//   };

//   useEffect(() => {
//     console.log("uESEEFEFEFCT");
//     userInputInfo["budget"] = currentBudget;
//     console.log(userInputInfo);
//   }, [currentBudget]);

//   return (
//     <div
//       className="btn-group"
//       role="group"
//       aria-label="Basic radio toggle button group"
//     >
//       <input
//         type="radio"
//         className="btn-check"
//         name="btnradio"
//         id="btnradio0"
//         autoComplete="off"
//         onClick={changeBudget}
//         value="0"
//       ></input>
//       <label className="btn btn-outline-primary" htmlFor="btnradio0">
//         $
//       </label>
//       <input
//         type="radio"
//         className="btn-check"
//         name="btnradio"
//         id="btnradio1"
//         autoComplete="off"
//         onClick={changeBudget}
//         value="1"
//       ></input>
//       <label className="btn btn-outline-primary" htmlFor="btnradio1">
//         $$
//       </label>

//       <input
//         type="radio"
//         className="btn-check"
//         name="btnradio"
//         id="btnradio2"
//         autoComplete="off"
//         onClick={changeBudget}
//         value="2"
//       ></input>
//       <label className="btn btn-outline-primary" htmlFor="btnradio2">
//         $$$
//       </label>

//       <input
//         type="radio"
//         className="btn-check"
//         name="btnradio"
//         id="btnradio3"
//         autoComplete="off"
//         onClick={changeBudget}
//         value="3"
//       ></input>
//       <label className="btn btn-outline-primary" htmlFor="btnradio3">
//         $$$$
//       </label>
//       <input
//         type="radio"
//         className="btn-check"
//         name="btnradio"
//         id="btnradio4"
//         autoComplete="off"
//         onClick={changeBudget}
//         value="4"
//       ></input>
//       <label className="btn btn-outline-primary" htmlFor="btnradio4">
//         $$$$$
//       </label>
//     </div>
//   );
// };
// export default UserBudget;

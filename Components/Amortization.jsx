const Amortization = ({
  emi,
  amortization,
  showGst,
  gstPercentage,
  totalInterestPayable,
  totalPayment,
  gstAmount,
}) => {
  const totalPrincipal = amortization.reduce((acc, item) => acc + item.principal, 0);

  return (
    <>
      {emi > 0 && (
        <div className="px-1 py-3">
          <h3 className="text-lg font-bold">EMI: ₹{emi.toFixed(2)}</h3>

          <h3 className="text-center bg-gray-50 dark:bg-gray-800 text-lg font-bold py-2 border-t border-r border-l rounded-t-lg border-gray-200 dark:border-gray-700 dark:text-gray-400">
            Amortization Schedule
          </h3>
          <div className="overflow-x-auto overflow-hidden border border-gray-200 dark:border-gray-700 rounded-b-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 capitalize bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Month</th>
                  <th scope="col" className="px-6 py-3">Opening Balance</th>
                  <th scope="col" className="px-6 py-3">EMI Amount</th>
                  <th scope="col" className="px-6 py-3">Principal Amt</th>
                  <th scope="col" className="px-6 py-3">Interest Amount</th>
                  {showGst && (
                    <th scope="col" className="px-6 py-3">GST</th>
                  )}
                  <th scope="col" className="px-6 py-3">Principal Balance</th>
                  <th scope="col" className="px-6 py-3">Final Amt</th>
                </tr>
              </thead>
              <tbody>
                {amortization.map((item) => (
                  <tr
                    key={item.month}
                    className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                  >
                    <td className="px-6 py-4">{item.month}</td>
                    <td className="px-6 py-4">₹{item.openingBalance.toFixed(2)}</td>
                    <td className="px-6 py-4">₹{item.emi.toFixed(2)}</td>
                    <td className="px-6 py-4">₹{item.principal.toFixed(2)}</td>
                    <td className="px-6 py-4">₹{item.interest.toFixed(2)}</td>
                    {showGst && (
                      <td className="px-6 py-4">₹{item.gst.toFixed(2)}</td>
                    )}
                    <td className="px-6 py-4">₹{item.closingBalance.toFixed(2)}</td>
                    <td className="px-6 py-4">₹{(item.principal + item.interest + (showGst ? item.gst : 0)).toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="px-6 py-4">Total</td>
                  <td className="px-6 py-4"></td>
                  <td className="px-6 py-4"></td>
                  <td className="px-6 py-4">₹{totalPrincipal.toFixed(2)}</td>
                  <td className="px-6 py-4">₹{totalInterestPayable.toFixed(2)}</td>
                  {showGst && <td className="px-6 py-4">₹{gstAmount.toFixed(2)}</td>}
                  <td className="px-6 py-4">=</td>
                  <td className="px-6 py-4">
                    ₹{(totalPrincipal + totalInterestPayable + (showGst ? gstAmount : 0)).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default Amortization;

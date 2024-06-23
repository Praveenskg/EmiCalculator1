
"use client"
import * as yup from "yup";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Loader } from "lucide-react";
import Header from "./Header";
import Amortization from "./Amortization";

const EmiForm = () => {
  const [showGst, setShowGst] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emi, setEmi] = useState(0);
  const [totalInterestPayable, setTotalInterestPayable] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [amortization, setAmortization] = useState([]);
  const [gstAmount, setGstAmount] = useState(0);
  const [hasInputValue, setHasInputValue] = useState(false);

  const toggleGst = (event) => {
    setShowGst(event.target.checked);
  };

  const handleChange = (event) => {
    formik.handleChange(event);
    const { value } = event.target;
    setHasInputValue(value.trim() !== "");
  };

  const handleReset = () => {
    formik.resetForm();
    setEmi(0);
    setTotalInterestPayable(0);
    setTotalPayment(0);
    setAmortization([]);
    setGstAmount(0);
    setLoading(false);
  };

  const validationSchema = yup.object({
    principal: yup
      .number()
      .required("Principal Amount is required")
      .min(100, "Principal Amount must be greater than 100"),
    interest: yup
      .number()
      .required("Interest Rate is required")
      .min(0, "Interest Rate must be non-negative"),
    tenure: yup
      .number()
      .required("Loan Tenure is required")
      .min(1, "Loan Tenure must be at least 1 month"),
    gst: yup
      .number()
      .when('showGst', {
        is: true,
        then: yup.number().min(1, "GST must be at least 5%"),
      }),
  });

  const formik = useFormik({
    initialValues: {
      principal: "",
      interest: "",
      tenure: "",
      gst: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        calculateEmiAndAmortization(values);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    },
    onReset: () => {
      setHasInputValue(false);
    },
  });

  const calculateEmiAndAmortization = (values) => {
    const principal = parseFloat(values.principal);
    const annualInterestRate = parseFloat(values.interest) / 100;
    const tenureMonths = parseInt(values.tenure);
    const monthlyInterestRate = annualInterestRate / 12;

    const emi =
      (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureMonths)) /
      (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1);
    setEmi(emi);

    const totalInterestPayable = emi * tenureMonths - principal;
    setTotalInterestPayable(totalInterestPayable);

    const totalPayment = principal + totalInterestPayable;
    setTotalPayment(totalPayment);

    const amortization = [];
    let balance = principal;
    for (let month = 1; month <= tenureMonths; month++) {
      const interestPayment = balance * monthlyInterestRate;
      const principalPayment = emi - interestPayment;
      balance -= principalPayment;

      const gstAmountForMonth = showGst ? (interestPayment * parseFloat(values.gst)) / 100 : 0;

      amortization.push({
        month,
        openingBalance: balance + principalPayment,
        emi,
        interest: interestPayment,
        principal: principalPayment,
        gst: gstAmountForMonth,
        closingBalance: balance,
      });
    }
    setAmortization(amortization);

    // Calculate total GST amount for all months
    const totalGstAmount = amortization.reduce((total, item) => total + item.gst, 0);
    setGstAmount(totalGstAmount);
  };

  useEffect(() => {
    if (totalInterestPayable && showGst && parseFloat(formik.values.gst) > 0) {
      const gstAmount = (totalInterestPayable * parseFloat(formik.values.gst)) / 100;
      setGstAmount(gstAmount);
    } else {
      setGstAmount(0);
    }
  }, [totalInterestPayable, showGst, formik.values.gst]);


  return (
    <>
      <div className="rounded-lg w-full md:px-3 shadow-lg md:mb-8">
        <Header />
        <div className="grid gap-2 rounded-lg p-4 lg:rounded-none lg:p-0 lg:backdrop-blur-none ">
          <form onSubmit={formik.handleSubmit} className="my-5 relative grid grid-cols-2 gap-4  p-3 ">

            <div className="md:col-span-1 col-span-2">
              <label htmlFor="principal" className="block text-sm text-gray-500 dark:text-gray-300 font-bold">Principal Amount</label>
              <input
                type="number"
                id="principal"
                name="principal"
                disabled={loading}
                value={formik.values.principal}
                onChange={handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Principal Amount"
                className={`
                  block w-full px-4 py-2 text-gray-700 bg-white bg-opacity-0 border rounded-lg
                  dark:text-gray-300 dark:border-gray-600 focus:border-indigo-600
                  dark:focus:border-indigo-500 focus:ring-indigo-300 focus:outline-none focus:ring
                  focus:ring-opacity-40
                  ${formik.touched.principal && formik.errors.principal ? "border-red-500" : ""}
                `}
              />
              {formik.touched.principal && formik.errors.principal && (
                <p className="text-red-500 ml-1">{formik.errors.principal}</p>
              )}
            </div>
            <div className="md:col-span-1 col-span-2">
              <label htmlFor="interest" className="block text-sm text-gray-500 dark:text-gray-300 font-bold">Interest Rate</label>
              <input
                type="number"
                id="interest"
                name="interest"
                disabled={loading}
                value={formik.values.interest}
                onChange={handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Interest Rate"
                className={`
                  block w-full px-4 py-2 text-gray-700 bg-white bg-opacity-0 border rounded-lg
                  dark:text-gray-300 dark:border-gray-600 focus:border-indigo-600
                  dark:focus:border-indigo-500 focus:ring-indigo-300 focus:outline-none focus:ring
                  focus:ring-opacity-40
                  ${formik.touched.interest && formik.errors.interest ? "border-red-500" : ""}
                `}
              />
              {formik.touched.interest && formik.errors.interest && (
                <p className="text-red-500 ml-1">{formik.errors.interest}</p>
              )}
            </div>
            <div className="md:col-span-1 col-span-2">
              <label htmlFor="tenure" className="block text-sm text-gray-500 dark:text-gray-300 font-bold">Loan Tenure</label>
              <input
                type="number"
                id="tenure"
                name="tenure"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                disabled={loading}
                value={formik.values.tenure}
                onChange={handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Tenure in Months"
                className={`
                  block w-full px-4 py-2 text-gray-700 bg-white bg-opacity-0 border rounded-lg
                  dark:text-gray-300 dark:border-gray-600 focus:border-indigo-600
                  dark:focus:border-indigo-500 focus:ring-indigo-300 focus:outline-none focus:ring
                  focus:ring-opacity-40
                  ${formik.touched.tenure && formik.errors.tenure ? "border-red-500" : ""}
                `}
              />
              {formik.touched.tenure && formik.errors.tenure && (
                <p className="text-red-500 ml-1">{formik.errors.tenure}</p>
              )}
            </div>
            {showGst && (
              <div className="md:col-span-1 col-span-2">
                <label htmlFor="gst" className="block text-sm text-gray-500 dark:text-gray-300 font-bold">GST</label>
                <input
                  type="number"
                  id="gst"
                  name="gst"
                  disabled={loading}
                  value={formik.values.gst}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter GST Rate"
                  className={`
                    block w-full px-4 py-2 text-gray-700 bg-white bg-opacity-0 border rounded-lg
                    dark:text-gray-300 dark:border-gray-600 focus:border-indigo-600
                    dark:focus:border-indigo-500 focus:ring-indigo-300 focus:outline-none focus:ring
                    focus:ring-opacity-40
                    ${formik.touched.gst && formik.errors.gst ? "border-red-500" : ""}
                  `}
                />
                {formik.touched.gst && formik.errors.gst && (
                  <p className="text-red-500 ml-1">{formik.errors.gst}</p>
                )}
              </div>
            )}
            <div className="col-span-2 flex items-center">
              <input
                type="checkbox"
                id="toggleGst"
                name="toggleGst"
                checked={showGst}
                onChange={toggleGst}
                className="mr-2"
              />
              <label htmlFor="toggleGst" className="block text-sm text-gray-500 dark:text-gray-300 font-bold">Include GST</label>
            </div>

            <div className="md:col-span-1 col-span-2 mt-4 flex justify-between">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-indigo-600 dark:bg-indigo-600 rounded-lg hover:bg-indigo-500 dark:hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
              >
                <span className="flex items-center justify-center">
                  {loading && <Loader className="mr-2 size-4 animate-spin" />}
                  Calculate
                </span>
              </button>
              {hasInputValue && (
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-600 dark:bg-red-600 rounded-lg hover:bg-red-500 dark:hover:bg-red-500 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50 ml-4"
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>
        <Amortization
          emi={emi}
          amortization={amortization}
          showGst={showGst}
          gstPercentage={parseFloat(formik.values.gst)}
          gstAmount={gstAmount}
          totalInterestPayable={totalInterestPayable}
          totalPayment={totalPayment}
        />
      </div>
    </>
  );
};

export default EmiForm;

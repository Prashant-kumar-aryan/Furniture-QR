export default async function Dashboard() {
  const fetchTransactions = async () => {
    const res = await fetch("http://localhost:3000/api/health", {
      method: "GET",
      cache: "no-store",
    });
    const data = await res.json();
    console.log("Transactions fetched:", data);
    return data;
  };

  const transactions = await fetchTransactions();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Transaction History</h1>
    </div>
  );
}

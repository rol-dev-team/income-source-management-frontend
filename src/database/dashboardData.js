import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";

const Dashboard = () => {
  // Dummy JSON Data
  const surveyWorkOrder = [
    { name: 'Jan', Survey: 4, WorkOrder: 2 },
    { name: 'Feb', Survey: 6, WorkOrder: 3 },
    { name: 'Mar', Survey: 9, WorkOrder: 5 },
    { name: 'Apr', Survey: 7, WorkOrder: 4 },
    { name: 'May', Survey: 8, WorkOrder: 6 },
  ];

  const nttnWiseSurvey = [
    { name: 'FGH', value: 52.1 },
    { name: 'Summit', value: 26.4 },
    { name: 'Bahon', value: 17.6 },
  ];

  const bwModification = [
    { name: 'Jan', Upgrade: 2, Downgrade: 1 },
    { name: 'Feb', Upgrade: 4, Downgrade: 2 },
    { name: 'Mar', Upgrade: 5, Downgrade: 4 },
    { name: 'Apr', Upgrade: 7, Downgrade: 3 },
    { name: 'May', Upgrade: 6, Downgrade: 5 },
  ];

  const nttnWorkOrder = [
    { name: 'FGH', value: 45 },
    { name: 'Summit', value: 30 },
    { name: 'Bahon', value: 25 },
  ];

  const categoryStats = [
    { name: 'Jan', Fiber: 10, Wireless: 6 },
    { name: 'Feb', Fiber: 13, Wireless: 8 },
    { name: 'Mar', Fiber: 15, Wireless: 7 },
    { name: 'Apr', Fiber: 18, Wireless: 10 },
    { name: 'May', Fiber: 25, Wireless: 14 },
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Survey vs Work Order - Bar Chart */}
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold mb-2">Survey vs Work Order</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={surveyWorkOrder}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Survey" fill="#8884d8" />
              <Bar dataKey="WorkOrder" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* NTTN Wise Survey - Pie Chart */}
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold mb-2">NTTN Wise Survey</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={nttnWiseSurvey}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {nttnWiseSurvey.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BW Modification - Line Chart */}
        <div className="bg-white p-4 shadow rounded col-span-1 xl:col-span-1">
          <h2 className="text-lg font-semibold mb-2">BW Modification</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={bwModification}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Upgrade" stroke="#8884d8" />
              <Line type="monotone" dataKey="Downgrade" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* NTTN Wise Work Order - Pie Chart */}
        <div className="bg-white p-4 shadow rounded col-span-1 xl:col-span-1">
          <h2 className="text-lg font-semibold mb-2">NTTN Work Order</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={nttnWorkOrder}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#82ca9d"
                label
              >
                {nttnWorkOrder.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Wise Stats - Bar Chart */}
        <div className="bg-white p-4 shadow rounded col-span-1 md:col-span-2 xl:col-span-3">
          <h2 className="text-lg font-semibold mb-2">Category Wise Statistics</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Fiber" fill="#8884d8" />
              <Bar dataKey="Wireless" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

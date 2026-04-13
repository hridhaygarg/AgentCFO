import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { AnimatedSection } from './AnimatedSection'

export default function Dashboard({ costs = [] }) {
  const mockChartData = [
    { date: 'Mon', cost: 15.20 },
    { date: 'Tue', cost: 12.50 },
    { date: 'Wed', cost: 18.75 },
    { date: 'Thu', cost: 14.30 },
    { date: 'Fri', cost: 22.10 },
    { date: 'Sat', cost: 8.40 },
    { date: 'Sun', cost: 11.20 },
  ]

  const totalWeeklyCost = mockChartData.reduce((sum, day) => sum + day.cost, 0)

  return (
    <div className="space-y-6">
      <AnimatedSection animation="fadeUp" delay={0}>
        <div className="bg-white rounded-lg shadow-md p-6" style={{
          transition: 'all 300ms cubic-bezier(0.16,1,0.3,1)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.06)',
        }} onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }} onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.06)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Cost Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="cost"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Daily Cost"
                style={{ animation: 'fadeIn 1200ms cubic-bezier(0.16,1,0.3,1) both 200ms' }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-center mt-4 text-gray-600" style={{ animation: 'fadeIn 600ms cubic-bezier(0.16,1,0.3,1) both 400ms' }}>
            Weekly Total: <span className="font-bold text-gray-900">${totalWeeklyCost.toFixed(2)}</span>
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="fadeUp" delay={100}>
        <div className="bg-white rounded-lg shadow-md p-6" style={{
          transition: 'all 300ms cubic-bezier(0.16,1,0.3,1)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.06)',
        }} onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }} onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.06)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Cost by Agent</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={costs.length > 0 ? Object.entries(costs).map(([name, data]) => ({
              name,
              cost: data.totalCost || 0,
            })) : []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Bar
                dataKey="cost"
                fill="#10b981"
                style={{ animation: 'fadeIn 1200ms cubic-bezier(0.16,1,0.3,1) both 200ms' }}
              />
            </BarChart>
          </ResponsiveContainer>
          {Object.keys(costs).length === 0 && (
            <p className="text-center text-gray-500 mt-4" style={{ animation: 'fadeIn 600ms cubic-bezier(0.16,1,0.3,1) both 400ms' }}>No cost data available</p>
          )}
        </div>
      </AnimatedSection>
    </div>
  )
}

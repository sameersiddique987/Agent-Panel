import { useState, useEffect } from 'react';
import axios from 'axios';

const AgentManagement = () => {
  const [selectedTab, setSelectedTab] = useState('allAgents');
  interface Agent {
    _id: string;
    name: string;
    email: string;
    performanceStats: {
      queriesOpened: number;
      queriesResponded: number;
      bookingsMade: number;
      invoicesGenerated: number;
    };
  }

  const [agents, setAgents] = useState<Agent[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);

  useEffect(() => {
    if (selectedTab === 'allAgents') {
      fetchAgents();
    }
  }, [selectedTab]);

  useEffect(() => {
    if (selectedTab === 'activityLog' && selectedAgentId) {
      fetchActivityLog(selectedAgentId);
    }
  }, [selectedTab, selectedAgentId]);

  const fetchAgents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/agents');
      setAgents(response.data);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };


  interface ActivityLog {
    action: string;
    timestamp: string;
  }

  const fetchActivityLog = async (agentId: string): Promise<void> => {
    try {
      const response = await axios.get<ActivityLog[]>(`http://localhost:5000/api/agents/${agentId}/activity-log`);
      setActivityLog(response.data);
    } catch (error) {
      console.error('Error fetching activity log:', error);
    }
  };

  const handleAddAgent = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/agents', { name, email, password });
      alert('Agent added successfully');
      setName('');
      setEmail('');
      setPassword('');
      fetchAgents();
    } catch (error) {
      console.error('Error adding agent:', error);
      alert('Error adding agent');
    }
  };

  const renderAllAgents = () => (
    <div>
      <h2>All Agents</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Queries Opened</th>
            <th>Queries Responded</th>
            <th>Bookings Made</th>
            <th>Invoices Generated</th>
            <th>Activity Log</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent._id}>
              <td>{agent.name}</td>
              <td>{agent.email}</td>
              <td>{agent.performanceStats.queriesOpened}</td>
              <td>{agent.performanceStats.queriesResponded}</td>
              <td>{agent.performanceStats.bookingsMade}</td>
              <td>{agent.performanceStats.invoicesGenerated}</td>
              <td>
                <button onClick={() => { setSelectedAgentId(agent._id); setSelectedTab('activityLog'); }}>
                  View Log
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderAddAgent = () => (
    <div>
      <h2>Add Agent</h2>
      <form onSubmit={handleAddAgent}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Add Agent</button>
      </form>
    </div>
  );

  const renderActivityLog = () => (
    <div>
      <h2>Activity Log</h2>
      <button onClick={() => setSelectedTab('allAgents')}>Back to All Agents</button>
      <ul>
        {activityLog.map((log, index) => (
          <li key={index}>
            {log.action} - {new Date(log.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'allAgents':
        return renderAllAgents();
      case 'addAgent':
        return renderAddAgent();
      case 'activityLog':
        return renderActivityLog();
      default:
        return null;
    }
  };

  return (
    <div>
      <h1>Agent Management</h1>
      <div className="tabs">
        <button onClick={() => setSelectedTab('allAgents')}>All Agents</button>
        <button onClick={() => setSelectedTab('addAgent')}>Add Agent</button>
      </div>
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AgentManagement;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Table,
  Button,
  Card,
  Row,
  Col,
  Badge,
  Alert
} from 'react-bootstrap';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchAnalytics();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/api/admin/analytics/subscriptions');
      setAnalytics(response.data);
    } catch (err) {
      setError('Failed to fetch analytics');
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await axios.patch(`/api/admin/users/${userId}/status`, {
        active: !currentStatus
      });
      fetchUsers(); // Refresh user list
    } catch (err) {
      setError('Failed to update user status');
    }
  };

  return (
    <Container className="py-4">
      {error && <Alert variant="danger">{error}</Alert>}
      
      <h2 className="mb-4">Admin Dashboard</h2>
      
      {analytics && (
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>Subscription Overview</Card.Title>
                <div className="d-flex justify-content-around">
                  {analytics.map(stat => (
                    <div key={stat.status} className="text-center">
                      <h3>{stat._count}</h3>
                      <p>{stat.status}</p>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Card>
        <Card.Body>
          <Card.Title>User Management</Card.Title>
          <Table responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Status</th>
                <th>Subscription</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge bg={user.active ? 'success' : 'danger'}>
                      {user.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg="info">
                      {user.subscription?.status || 'No Subscription'}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant={user.active ? 'danger' : 'success'}
                      size="sm"
                      onClick={() => toggleUserStatus(user.id, user.active)}
                    >
                      {user.active ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminDashboard;
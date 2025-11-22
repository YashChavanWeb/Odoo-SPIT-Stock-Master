import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import { useAuth } from '../../../context/AuthContext';

const metrics = [
  {
    title: 'Velocity score',
    value: '92',
    helper: '+8 vs. last sprint',
    icon: <TrendingUpIcon />,
  },
  {
    title: 'Active builders',
    value: '18',
    helper: '4 pending invites',
    icon: <Diversity3Icon />,
  },
  {
    title: 'Launch readiness',
    value: '74%',
    helper: 'Ship checklist updated',
    icon: <RocketLaunchIcon />,
  },
];

const greetUser = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const handleInvite = (event) => {
    event.preventDefault();
    setInviteOpen(false);
    setInviteEmail('');
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <Avatar src={user?.avatar}>{user?.name?.charAt(0)}</Avatar>
          <div>
            <p className="text-sm text-muted">{greetUser()}</p>
            <h1 className="text-2xl font-semibold">{user?.name}</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setInviteOpen(true)}>
            Invite teammate
          </Button>
          <Button>New project</Button>
        </div>
      </div>

      <Grid container spacing={3}>
        {metrics.map((metric) => (
          <Grid item xs={12} md={4} key={metric.title}>
            <Card className="h-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-muted">{metric.title}</p>
                  <p className="text-3xl font-semibold">{metric.value}</p>
                  <span className="text-xs uppercase text-brand-500">{metric.helper}</span>
                </div>
                <div className="rounded-2xl bg-brand-50 p-3 text-brand-500">{metric.icon}</div>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Team activity</h3>
            <p className="text-sm text-muted">Recent updates from across your workspace.</p>
          </div>
          <Button variant="ghost">View timeline</Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`activity-${index}`}
              className="rounded-2xl border border-slate-100 p-4 dark:border-slate-700"
            >
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Sprint {index + 1}
              </p>
              <p className="text-xs text-muted">Updated 2h ago • 4 contributors</p>
            </div>
          ))}
        </div>
      </Card>
      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite teammate">
        <form className="space-y-4" onSubmit={handleInvite}>
          <Input
            label="Email address"
            type="email"
            required
            value={inviteEmail}
            onChange={(event) => setInviteEmail(event.target.value)}
          />
          <Button type="submit" fullWidth>
            Send invite
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default DashboardPage;


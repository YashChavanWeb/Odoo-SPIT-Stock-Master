// src/components/ui/Placeholder.jsx
import Container from '@mui/material/Container';
import Card from './Card';

const Placeholder = ({ title }) => (
  <Container maxWidth="md" className="mt-10">
    <Card>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-muted">This area is ready for your next big idea.</p>
    </Card>
  </Container>
);

export default Placeholder;

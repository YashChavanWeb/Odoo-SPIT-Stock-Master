import Grid from '@mui/material/Grid';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { FEATURE_CARDS, CTA_BENEFITS } from '../../constants';

const LandingPage = () => (
  <div className="space-y-20">
    <section className="grid gap-10 md:grid-cols-2 items-center">
      <div className="space-y-6">
        <p className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-4 py-2 text-xs font-semibold uppercase text-brand-500 shadow-soft">
          Ready in minutes • Built for hackathons
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold leading-tight text-slate-900 dark:text-white">
          Production-ready frontend kit for high-velocity teams.
        </h1>
        <p className="text-lg text-muted">
          React, Tailwind, and Material UI working together with routing, contexts, API helpers, and
          layouts. Ship your MVP without losing polish.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" href="/signup">
            Launch Console
          </Button>
          <Button variant="ghost" size="lg" href="#product">
            View Components
          </Button>
        </div>
      </div>
      <div className="rounded-3xl border border-brand-100 bg-white/80 p-6 shadow-soft dark:bg-slate-800/80">
        <img
          src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80"
          alt="Product preview"
          className="rounded-2xl object-cover"
        />
      </div>
    </section>

    <section id="product" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-500">Component System</p>
          <h2 className="text-3xl font-semibold">Composable building blocks</h2>
        </div>
        <Button variant="ghost" href="/dashboard">
          Preview dashboard
        </Button>
      </div>
      <Grid container spacing={3}>
        {FEATURE_CARDS.map((card) => (
          <Grid item xs={12} md={4} key={card.title}>
            <Card className="h-full">
              <p className="text-sm font-semibold text-brand-500">{card.stat}</p>
              <h3 className="text-xl font-semibold">{card.title}</h3>
              <p className="text-muted">{card.description}</p>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {card.helper}
              </span>
            </Card>
          </Grid>
        ))}
      </Grid>
    </section>

    <section
      id="solutions"
      className="rounded-3xl border border-slate-100 bg-gradient-to-r from-brand-600 to-brand-500 p-10 text-white shadow-soft"
    >
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase">Built-in wins</p>
        <h2 className="text-3xl font-semibold">What teams unlock with Hackathon HQ</h2>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {CTA_BENEFITS.map((benefit) => (
          <div
            key={benefit}
            className="rounded-2xl bg-white/10 p-4 text-sm font-medium backdrop-blur-md"
          >
            {benefit}
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default LandingPage;


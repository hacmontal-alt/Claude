import { serve } from 'inngest/next';
import { inngest } from '@/lib/inngest/client';
import { runAnalysis } from '@/lib/inngest/functions/analysis-run';
import { autoGenerate } from '@/lib/inngest/functions/auto-generate';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [runAnalysis, autoGenerate],
});

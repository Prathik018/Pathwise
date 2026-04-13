'use client';

import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, CartesianGrid } from 'recharts';
import {
  BriefcaseIcon,
  CalendarClock,
  LineChart,
  TrendingUp,
  TrendingDown,
  Brain,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const salaryChartConfig = {
  min: { label: 'Min Salary (K)', color: '#93c5fd' },
  median: { label: 'Median Salary (K)', color: '#3b82f6' },
  max: { label: 'Max Salary (K)', color: '#1d4ed8' },
};

const DashboardView = ({ insights }) => {
  // Transform salary data for the chart
  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));

  const getDemandLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case 'positive':
        return { icon: TrendingUp, color: 'text-green-500' };
      case 'neutral':
        return { icon: LineChart, color: 'text-yellow-500' };
      case 'negative':
        return { icon: TrendingDown, color: 'text-red-500' };
      default:
        return { icon: LineChart, color: 'text-gray-500' };
    }
  };

  const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
  const outlookColor = getMarketOutlookInfo(insights.marketOutlook).color;

  // Format dates using date-fns
  const lastUpdatedDate = format(new Date(insights.lastUpdated), 'dd/MM/yyyy');
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    { addSuffix: true },
  );

  const normalizeSkill = (skill) =>
    String(skill || '')
      .trim()
      .toLowerCase();
  const userSkillSet = new Set((insights.userSkills || []).map(normalizeSkill));

  const recommendedSkills = Array.from(
    new Set([
      ...(insights.recommendedSkills || []),
      ...(insights.topSkills || []),
    ]),
  ).filter((skill) => !userSkillSet.has(normalizeSkill(skill)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-8"
    >
      {/* Market Overview Cards */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="gap-1.5">
          <CalendarClock className="h-3.5 w-3.5" />
          Last updated: {lastUpdatedDate}
        </Badge>
        <Badge variant="secondary">Next update {nextUpdateDistance}</Badge>
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08 } },
        }}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">
                Market Outlook
              </CardTitle>
              <OutlookIcon className={`h-4 w-4 ${outlookColor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tracking-tight">
                {insights.marketOutlook}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Forward-looking trend signal
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">
                Industry Growth
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tracking-tight">
                {insights.growthRate.toFixed(1)}%
              </div>
              <Progress value={insights.growthRate} className="mt-3" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">
                Demand Level
              </CardTitle>
              <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tracking-tight">
                {insights.demandLevel}
              </div>
              <div
                className={`mt-3 h-2 w-full rounded-full ${getDemandLevelColor(
                  insights.demandLevel,
                )}`}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {insights.topSkills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="grid grid-cols-1 gap-4 xl:grid-cols-3"
      >
        {/* Salary Ranges Chart */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Salary Ranges by Role</CardTitle>
            <CardDescription>
              Displaying minimum, median, and maximum salaries (in thousands)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={salaryChartConfig}
              className="h-[380px] w-full"
            >
              <BarChart accessibilityLayer data={salaryData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar
                  dataKey="min"
                  fill="var(--color-min)"
                  name="Min Salary (K)"
                  radius={4}
                />
                <Bar
                  dataKey="median"
                  fill="var(--color-median)"
                  name="Median Salary (K)"
                  radius={4}
                />
                <Bar
                  dataKey="max"
                  fill="var(--color-max)"
                  name="Max Salary (K)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Skills</CardTitle>
            <CardDescription>
              Skills to consider developing ({recommendedSkills.length})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {recommendedSkills.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Industry Trends */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="grid grid-cols-1 gap-4"
      >
        <Card>
          <CardHeader>
            <CardTitle>Key Industry Trends</CardTitle>
            <CardDescription>
              Current trends shaping the industry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {insights.keyTrends.map((trend, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 rounded-lg border bg-muted/20 p-3"
                >
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm leading-relaxed">{trend}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DashboardView;

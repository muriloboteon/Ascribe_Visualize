import { LegacyCard, BlockStack, Text, Box } from '@shopify/polaris';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList
} from 'recharts';

const data = [
    {
        date: '8/1/2011',
        'Exercise equipment broken': 52,
        'Gym equipment outdated': 45,
        'Locker rooms dirty': 39,
        'Bathrooms dirty': 31,
        'Front desk staff (neg)': 26,
        'Paper towels unavailable': 24
    },
    {
        date: '8/8/2011',
        'Exercise equipment broken': 36,
        'Gym equipment outdated': 25,
        'Locker rooms dirty': 32,
        'Bathrooms dirty': 23,
        'Front desk staff (neg)': 24,
        'Paper towels unavailable': 20
    },
    {
        date: '8/15/2011',
        'Exercise equipment broken': 25,
        'Gym equipment outdated': 27,
        'Locker rooms dirty': 24,
        'Bathrooms dirty': 18,
        'Front desk staff (neg)': 21,
        'Paper towels unavailable': 14
    },
    {
        date: '8/22/2011',
        'Exercise equipment broken': 27,
        'Gym equipment outdated': 15,
        'Locker rooms dirty': 19,
        'Bathrooms dirty': 13,
        'Front desk staff (neg)': 11,
        'Paper towels unavailable': 7
    },
    {
        date: '8/29/2011',
        'Exercise equipment broken': 16,
        'Gym equipment outdated': 10,
        'Locker rooms dirty': 14,
        'Bathrooms dirty': 8,
        'Front desk staff (neg)': 9,
        'Paper towels unavailable': 10
    },
];

const colors = [
    '#005bd3', // Blue
    '#f49342', // Orange
    '#50b83c', // Green
    '#9c6ade', // Purple
    '#fscd-0', // Yellow-ish (approximation)
    '#f5c945', // Yellow
    '#de3618', // Red
];

const categories = [
    'Exercise equipment broken',
    'Gym equipment outdated',
    'Locker rooms dirty',
    'Bathrooms dirty',
    'Front desk staff (neg)',
    'Paper towels unavailable'
];

export function TimelineAnalysisChart() {
    return (
        <LegacyCard sectioned>
            <BlockStack gap="400">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text as="h2" variant="headingMd">Murilo - 121825: Comments - _Week_Date_</Text>
                </div>
                <Box paddingBlockEnd="400">
                    <div style={{ height: 500, width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={data}
                                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="#e1e3e5" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#202223' }}
                                    padding={{ left: 30, right: 30 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#202223' }}
                                    label={{ value: 'Comments', angle: -90, position: 'insideLeft', offset: 0, style: { fill: '#6D7175' } }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                                />
                                <Legend
                                    layout="vertical"
                                    verticalAlign="top"
                                    align="right"
                                    wrapperStyle={{ paddingLeft: '20px' }}
                                />
                                {categories.map((category, index) => (
                                    <Line
                                        key={category}
                                        type="monotone"
                                        dataKey={category}
                                        stroke={colors[index % colors.length]}
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 6 }}
                                    >
                                        <LabelList
                                            dataKey={category}
                                            position="top"
                                            offset={10}
                                            style={{ fontSize: 10, fill: colors[index % colors.length] }}
                                        />
                                    </Line>
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Box>
            </BlockStack>
        </LegacyCard>
    );
}

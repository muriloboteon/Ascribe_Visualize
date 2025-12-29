import { LegacyCard, BlockStack, Text } from '@shopify/polaris';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    LabelList,
    Cell,
    Label
} from 'recharts';
import { ChartActions } from './ChartActions';

interface DataItem {
    name: string;
    value: number;
    isCategory: boolean;
}

const data: DataItem[] = [
    { name: 'Locker Rooms And Shower Cleanliness', value: 321, isCategory: true },
    { name: 'Locker rooms dirty and unclean', value: 120, isCategory: false },
    { name: 'Bathrooms dirty and unsanitary', value: 109, isCategory: false },
    { name: 'Shower areas and facilities dirty', value: 67, isCategory: false },
    { name: 'Facility Odors And Overall Cleanliness', value: 294, isCategory: true },
    { name: 'Member hygiene and facility cleanliness poor', value: 89, isCategory: false },
    { name: 'Overall facility cleanliness poor', value: 81, isCategory: false },
    { name: 'Facility odors unpleasant', value: 63, isCategory: false },
    { name: 'Member Retention And Satisfaction', value: 282, isCategory: true },
    { name: 'Overall club experience satisfaction', value: 70, isCategory: false },
    { name: 'Members switching to competitor gyms', value: 53, isCategory: false },
    { name: 'Overall gym satisfaction', value: 53, isCategory: false },
    { name: 'Staff Friendliness And Professionalism', value: 246, isCategory: true },
    { name: 'Staff helpful and professional', value: 91, isCategory: false },
    { name: 'Staff friendly and welcoming', value: 84, isCategory: false },
    { name: 'Staff unfriendly and unprofessional', value: 80, isCategory: false },
    { name: 'Exercise Equipment Broken And Unrepaired', value: 230, isCategory: true },
    { name: 'Exercise equipment broken and unrepaired', value: 156, isCategory: false },
    { name: 'Treadmills frequently broken and need repair', value: 42, isCategory: false },
    { name: 'Exercise bikes broken and non-functional', value: 25, isCategory: false },
];

const CustomYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    // Find properly the data item to check if it represents a category
    // payload.value is the name string
    const item = data.find(d => d.name === payload.value);
    const isCategory = item?.isCategory;

    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={0}
                dy={4}
                textAnchor="end"
                fill={isCategory ? '#202223' : '#6D7175'}
                fontWeight={isCategory ? 700 : 400}
                fontSize={11}
            >
                {payload.value}
            </text>
        </g>
    );
};

interface CommentsAnalysisChartProps {
    onBarClick?: (data: any) => void;
}

export function CommentsAnalysisChart({ onBarClick }: CommentsAnalysisChartProps) {
    return (
        <LegacyCard sectioned>
            <BlockStack gap="400">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text as="h2" variant="headingMd">Murilo - 121825: Comments - 20 items</Text>
                    <ChartActions />
                </div>
                <div style={{ height: 600, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={data}
                            margin={{ top: 5, right: 50, left: 20, bottom: 5 }}
                        >

                            <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="#e1e3e5" />
                            <XAxis
                                type="number"
                                tick={{ fontSize: 11, fill: '#6D7175' }}
                                axisLine={{ stroke: '#e1e3e5' }}
                                tickLine={{ stroke: '#e1e3e5' }}
                                domain={[0, 'auto']}
                            >
                                <Label value="Comments" offset={-5} position="insideBottom" style={{ fontSize: 12, fill: '#202223' }} />
                            </XAxis>
                            <YAxis
                                dataKey="name"
                                type="category"
                                width={300}
                                tick={<CustomYAxisTick />}
                                interval={0}
                            />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e1e3e5', boxShadow: '0px 4px 8px rgba(0,0,0,0.05)' }}
                            />
                            <Bar
                                dataKey="value"
                                radius={[0, 4, 4, 0]}
                                barSize={20}
                                onClick={(data) => onBarClick && onBarClick(data)}
                                style={{ cursor: 'pointer' }}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.isCategory ? '#454f5b' : '#999fa4'} />
                                ))}
                                <LabelList
                                    dataKey="value"
                                    position="right"
                                    style={{ fontSize: 11, fill: '#202223' }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </BlockStack>
        </LegacyCard>
    );
}

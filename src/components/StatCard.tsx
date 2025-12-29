import { Card, Text, BlockStack, InlineStack, Icon } from '@shopify/polaris';
import { ArrowUpIcon, ArrowDownIcon } from '@shopify/polaris-icons';

interface StatCardProps {
    title: string;
    amount: string;
    percentage: number;
    isIncrease: boolean;
}

export function StatCard({ title, amount, percentage, isIncrease }: StatCardProps) {
    return (
        <Card>
            <BlockStack gap="200">
                <Text as="h3" variant="headingSm" fontWeight="medium" tone="subdued">
                    {title}
                </Text>
                <InlineStack align="space-between" blockAlign="center">
                    <Text as="p" variant="headingLg">
                        {amount}
                    </Text>
                    <InlineStack gap="100" blockAlign="center">
                        <Icon
                            source={isIncrease ? ArrowUpIcon : ArrowDownIcon}
                            tone={isIncrease ? 'success' : 'critical'}
                        />
                        <Text
                            as="span"
                            variant="bodySm"
                            tone={isIncrease ? 'success' : 'critical'}
                        >
                            {percentage}%
                        </Text>
                    </InlineStack>
                </InlineStack>
            </BlockStack>
        </Card>
    );
}

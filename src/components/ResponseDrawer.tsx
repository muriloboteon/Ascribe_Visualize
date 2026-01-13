import { Text, Button, BlockStack, TextField, Icon, Tabs } from '@shopify/polaris';
import { XIcon, ArrowLeftIcon, SearchIcon, ExportIcon, EditIcon } from '@shopify/polaris-icons';
import { useState, useMemo, useCallback, type MouseEvent } from 'react';

interface ResponseDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

// Mock Data
// Mock Data Interface
interface CommentData {
    id: number;
    text: string;
    sentiment: 'Positive' | 'Negative' | 'Neutral';
    codes: Array<{
        segment: string; // The portion of text highlighted
        code: string;    // The taxonomy label (e.g., "Cleanliness")
        idea: string;    // The key idea (e.g., "Locker rooms are consistently dirty")
    }>;
}

const ALL_COMMENTS: CommentData[] = [
    {
        id: 1,
        text: "1- All new staff- very unfriendly greeting. Had to tell the front desk person the procedure for checking my son into the daycare and she acted pissed off that I would make her take the extra step 2- we apparently have a new GM? What happened to Chuck? Chuck was friendly, introduced himself, walked around. The 'new' GM did not acknowledge anyone coming in, going out, etc. 3 - My regular complaint about this ACMEs - not enough daycare hours. No daycare on friday afternoons (not cool), and now Saturday daycre doesnt open until 830, which means those of us with kids can't participate in the 815 am classes. 4- classrooms do not have AC - boot camp class is totally fun, but a lot of the sweat comes from the lack of AC/air circulation. yuck",
        sentiment: "Negative",
        codes: [
            { segment: "very unfriendly greeting", code: "Staff Friendliness", idea: "Staff greeting was unwelcoming" },
            { segment: "new GM did not acknowledge", code: "Management Engagement", idea: "General Manager fails to interact with members" },
            { segment: "not enough daycare hours", code: "Service Availability", idea: "Daycare hours are insufficient" },
            { segment: "classrooms do not have AC", code: "Facility Conditions", idea: "Lack of air conditioning in classrooms" }
        ]
    },
    {
        id: 8,
        text: "here are the things that you need to consider: 1. gym is very dirty, trash is everywhere, papers and plastic bottles are on the floor 2. most machines and equipments are not working especially the stairclimbers on the 2nd floor, equipments are so filthy and full of sweat, no one is cleaning them. sometimes i dont want to even want to use them coz of all the dust and sweat. 3.bathroom and lockers are so dirty, hairs and water is everywhere, some cubicle for chaning are not working properly, toliets and sink are filthy and so smelly. 4. weight and dumbells are everywhere, they are even on the side of the running track and they are very dangerous to the memebers who are running. no one of the staffs would take them out from the track and put them on their right places. i already told some of the staffs about it and they just ignored my complaints. 5. the rubber mats in the aerobics room are so dirty, filthy, torn to small pieces. aerobics ball are deflated, dumbells are so filthy and smells so bad. 6. club should put a stall of paper towels to eery corner of the gym so members can wipe the equipment after using them. 7. staff should be friendly and approachable at all times, sometimes you ask for some favors and they will not do anything.",
        sentiment: "Negative",
        codes: [
            { segment: "gym is very dirty", code: "Cleanliness", idea: "General gym area is consistently dirty" },
            { segment: "machines and equipments are not working", code: "Equipment Maintenance", idea: "Multiple machines are out of order" },
            { segment: "bathroom and lockers are so dirty", code: "Cleanliness", idea: "Locker rooms and bathrooms are unhygienic" },
            { segment: "weight and dumbells are everywhere", code: "Safety / Organization", idea: "Weights are left disorganized creating hazards" }
        ]
    },
    {
        id: 9,
        text: "I AM EXTREMELY DISATISFIED BY THE DECEIVING BILLING PRACTICES OF ACME'S FITNESS CENTERS CORPORATE OFFICES. I HAVE HAD PROBLEMS WITH MY BILLING SINCE THE FIRST MONTH I SIGN UP, AND BY READING IN THE INTERNET, THERE ARE MANY OTHERS WITH THE SAME COMPLAIN. I USE THE CLUB MAINLY FOR THE SWIMMING POOL AND THE STEAM ROOM. BOTH OF THESE NEED A COMPLETE REMODELING, UPGRADE AND UPKEEPING. WERE IT NOT BECAUSE MY OWN SWIMMING POOL IS BEEING REPAIRED RIGHT NOW AND BECAUSE OF THE FRIENDLINESS OF YOUR CLUB MANAGER CARLOS, I WILL CANCEL MY SUBSCRIPTION WHICH I AM PLANNING TO DO AS SOON AS MY POOL IS FINISHED UNLESS SOMETHING IS DONE ABOUT MY OBJECTIONS.",
        sentiment: "Negative",
        codes: [
            { segment: "DECEIVING BILLING PRACTICES", code: "Billing Issues", idea: "Practices felt deceptive by member" },
            { segment: "COMPLETE REMODELING", code: "Facility Upgrades", idea: "Pool and steam room need renovation" },
            { segment: "CANCEL MY SUBSCRIPTION", code: "Churn Risk", idea: "Member threatening cancellation" }
        ]
    },
    {
        id: 2,
        text: "Being an overweight person, I was totally scared to join, but the staff made me feel comfortable and I love the women's section!",
        sentiment: "Positive",
        codes: [
            { segment: "staff made me feel comfortable", code: "Staff Friendliness", idea: "Staff helped reduce anxiety" },
            { segment: "love the women's section", code: "Facility Layout", idea: "Women's section is appreciated" }
        ]
    }
];

// Helper to render text with highlights
const HighlightedText = ({
    text,
    codes,
    hoveredSegment
}: {
    text: string,
    codes?: Array<{ segment: string }>,
    hoveredSegment?: string | null
}) => {
    if (!codes || codes.length === 0) return <span>{text}</span>;

    // Create a regex that matches ANY of the segments
    // We sort by length (descending) to ensure longer matches are prioritized if there's overlap potential
    const sortedSegments = [...codes].sort((a, b) => b.segment.length - a.segment.length);
    const pattern = sortedSegments
        .map(c => c.segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|');

    const regex = new RegExp(`(${pattern})`, 'gi');
    const parts = text.split(regex);

    return (
        <span style={{ lineHeight: '1.6' }}>
            {parts.map((part, i) => {
                // Check if this part matches ANY code segment (case insensitive)
                const matchedCode = codes.find(c => c.segment.toLowerCase() === part.toLowerCase());
                const isHovered = hoveredSegment && matchedCode?.segment === hoveredSegment;

                return matchedCode ? (
                    <span
                        key={i}
                        style={{
                            backgroundColor: isHovered ? '#ffd6a4' : 'rgba(69, 79, 91, 0.12)', // Darker orange if hovered, std grey otherwise
                            color: '#202223',
                            padding: '2px 4px',
                            margin: '0 -2px',
                            borderRadius: '4px',
                            fontWeight: '500',
                            transition: 'background-color 0.2s ease',
                            borderBottom: isHovered ? '2px solid #ff8800' : 'none'
                        }}
                    >
                        {part}
                    </span>
                ) : (
                    <span key={i}>{part}</span>
                );
            })}
        </span>
    );
};

export function ResponseDrawer({ isOpen, onClose }: ResponseDrawerProps) {
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedComment, setSelectedComment] = useState<CommentData | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    // State for navigation modes
    const [viewMode, setViewMode] = useState<'list' | 'details'>('list');
    // State for interactive highlighting
    const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

    const handleTabChange = useCallback(
        (selectedTabIndex: number) => setSelectedTab(selectedTabIndex),
        [],
    );

    const filteredComments = useMemo(() => {
        if (!searchQuery.trim()) return ALL_COMMENTS;
        const lowerQuery = searchQuery.toLowerCase();
        return ALL_COMMENTS.filter(comment =>
            comment.text.toLowerCase().includes(lowerQuery)
        );
    }, [searchQuery]);

    const handleCloseDetails = () => {
        setSelectedComment(null);
        setViewMode('list');
        setHoveredSegment(null);
    };

    const tabs = [
        {
            id: 'open-ends',
            content: 'Responses',
            accessibilityLabel: 'Open Ends',
            panelID: 'open-ends-panel',
        }
    ];

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '450px',
            backgroundColor: '#ffffff',
            boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
            zIndex: 5000,
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '1px solid #e1e3e5',
        }}>
            {/* Header */}
            <div style={{
                padding: '20px',
                borderBottom: '1px solid #e1e3e5',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#f9fafb',
                minHeight: '80px'
            }}>
                {viewMode !== 'list' && selectedComment ? (
                    // Detail Header
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Button icon={ArrowLeftIcon} onClick={handleCloseDetails} />
                        <div>
                            <Text as="h2" variant="headingMd">Response #{selectedComment.id}</Text>
                        </div>
                    </div>
                ) : (
                    // Main Header
                    <div style={{ paddingRight: '16px' }}>
                        <Text as="h2" variant="headingMd">Response Drawer</Text>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {viewMode === 'list' && (
                        <Button
                            icon={ExportIcon}
                            variant="plain"
                            onClick={() => console.log('Exporting...')}
                            accessibilityLabel="Export Data"
                        />
                    )}
                    <Button
                        icon={XIcon}
                        variant="plain"
                        onClick={onClose}
                        accessibilityLabel="Close"
                    />
                </div>
            </div>

            {/* Content Area */}
            {viewMode === 'details' && selectedComment ? (
                // Drill-down Detail View
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px', backgroundColor: '#fff' }}>
                    <BlockStack gap="500">
                        {/* Comment Text */}
                        <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e1e3e5' }}>
                            <Text as="h3" variant="headingXs">Comment</Text>
                            <div style={{ marginTop: '8px' }}>
                                <Text as="p" variant="bodyMd">
                                    <HighlightedText
                                        text={selectedComment.text}
                                        codes={selectedComment.codes}
                                        hoveredSegment={hoveredSegment}
                                    />
                                </Text>
                            </div>
                        </div>

                        {/* Applied Codes Section (Consolidated) */}
                        <div style={{ padding: '16px', border: '1px solid #e1e3e5', borderRadius: '8px' }}>
                            <BlockStack gap="300">
                                <Text as="h3" variant="headingXs">Applied Codes</Text>
                                <BlockStack gap="200">
                                    {selectedComment.codes?.map((item, index) => (
                                        <div
                                            key={index}
                                            onMouseEnter={() => setHoveredSegment(item.segment)}
                                            onMouseLeave={() => setHoveredSegment(null)}
                                            style={{
                                                padding: '12px',
                                                backgroundColor: hoveredSegment === item.segment ? '#fff5ea' : '#ffffff', // Light orange bg on hover
                                                border: hoveredSegment === item.segment ? '1px solid #ff8800' : '1px solid #dfe3e8', // Orange border on hover
                                                borderRadius: '6px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '4px',
                                                cursor: 'default',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div style={{
                                                    backgroundColor: '#e4e5e7',
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    display: 'inline-block'
                                                }}>
                                                    <Text as="span" variant="bodySm" fontWeight="bold">{item.code}</Text>
                                                </div>
                                                <div
                                                    role="button"
                                                    style={{ cursor: 'pointer', display: 'flex', padding: '2px' }}
                                                    onClick={() => console.log('Edit code', item.code)}
                                                >
                                                    <Icon source={EditIcon} tone="subdued" />
                                                </div>
                                            </div>

                                            <div style={{ marginTop: '4px' }}>
                                                <Text as="p" variant="bodyMd">
                                                    <span style={{ color: '#6d7175', marginRight: '6px', fontSize: '0.9em' }}>Idea:</span>
                                                    {item.idea}
                                                </Text>
                                            </div>
                                        </div>
                                    ))}
                                </BlockStack>
                            </BlockStack>
                        </div>

                        {/* Sentiment */}
                        <div style={{ padding: '16px', border: '1px solid #e1e3e5', borderRadius: '8px' }}>
                            <BlockStack gap="200">
                                <Text as="h3" variant="headingXs">Analysis</Text>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text as="span" variant="bodyMd">Sentiment</Text>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            backgroundColor: selectedComment.sentiment === 'Negative' ? '#d82c0d' : '#008060'
                                        }} />
                                        <Text as="span" tone={selectedComment.sentiment === 'Negative' ? 'critical' : 'success'}>
                                            {selectedComment.sentiment}
                                        </Text>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text as="span" variant="bodyMd">NPS Category</Text>
                                    <Text as="span" tone="critical">Detractor</Text>
                                </div>
                            </BlockStack>
                        </div>

                        {/* Metadata */}
                        <div style={{ padding: '16px', border: '1px solid #e1e3e5', borderRadius: '8px' }}>
                            <BlockStack gap="400">
                                <Text as="h3" variant="headingXs">Respondent Info</Text>

                                <BlockStack gap="300">
                                    <div>
                                        <Text as="p" tone="subdued" variant="bodyXs">Respondent ID</Text>
                                        <div style={{ wordBreak: 'break-all' }}>
                                            <Text as="p" variant="bodyMd">84291</Text>
                                        </div>
                                    </div>
                                    <div>
                                        <Text as="p" tone="subdued" variant="bodyXs">Date</Text>
                                        <Text as="p" variant="bodyMd">40780</Text>
                                    </div>
                                    <div>
                                        <Text as="p" tone="subdued" variant="bodyXs">Week Date</Text>
                                        <Text as="p" variant="bodyMd">8/22/2011</Text>
                                    </div>
                                    <div>
                                        <Text as="p" tone="subdued" variant="bodyXs">Region</Text>
                                        <Text as="p" variant="bodyMd">North America (East Coast Operations)</Text>
                                    </div>
                                </BlockStack>
                            </BlockStack>
                        </div>
                    </BlockStack>
                </div>
            ) : (
                // Main List View
                <>
                    <div style={{ padding: '0 16px', borderBottom: '1px solid #e1e3e5' }}>
                        <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange} />
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                        <BlockStack gap="400">
                            {/* Search Toolbar */}
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                                <div style={{ flex: 1 }}>
                                    <TextField
                                        label="Search"
                                        labelHidden
                                        value={searchQuery}
                                        onChange={(val) => setSearchQuery(val)}
                                        placeholder="Search responses..."
                                        prefix={<Icon source={SearchIcon} tone="subdued" />}
                                        autoComplete="off"
                                        clearButton
                                        onClearButtonClick={() => setSearchQuery('')}
                                    />
                                </div>
                            </div>

                            {filteredComments.length > 0 ? (
                                filteredComments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        onClick={() => {
                                            setSelectedComment(comment);
                                            setViewMode('details');
                                        }}
                                        style={{
                                            padding: '20px 0',
                                            borderBottom: '1px solid #f1f2f3',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <div style={{ marginBottom: '8px' }}>
                                            <Text as="p" variant="bodyMd">
                                                <span style={{ fontWeight: '600', marginRight: '4px' }}>{comment.id}.</span>
                                                <HighlightedText text={comment.text} codes={comment.codes ? [comment.codes[0]] : []} />
                                            </Text>
                                        </div>

                                        <div
                                            style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}
                                            onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                                        >
                                            <Button variant="plain" onClick={() => {
                                                setSelectedComment(comment);
                                                setViewMode('details');
                                            }}>View details</Button>

                                            {comment.codes && comment.codes.length > 1 && (
                                                <Button
                                                    variant="plain"
                                                    size="slim"
                                                    tone="critical"
                                                    onClick={() => {
                                                        setSelectedComment(comment);
                                                        setViewMode('details');
                                                    }}
                                                >
                                                    {`+${comment.codes.length - 1} codes applied`}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                                    <Text as="p" tone="subdued">No responses match your search.</Text>
                                    <Button variant="plain" onClick={() => setSearchQuery('')}>Clear search</Button>
                                </div>
                            )}
                        </BlockStack>
                    </div>
                </>
            )}
        </div>
    );
}

import { Text, Button, BlockStack, TextField, Icon, Tabs, Popover, Modal } from '@shopify/polaris';
import { XIcon, SearchIcon, EditIcon } from '@shopify/polaris-icons';
import { useState, useMemo, useCallback, useRef } from 'react';

// Common interfaces
interface ResponseDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

interface CommentData {
    id: number;
    text: string;
    sentiment: 'Positive' | 'Negative' | 'Neutral';
    codes: Array<{
        segment: string;
        code: string | null; // Null implies "Uncoded Segment"
        idea: string;
    }>;
}

// Mock Data for Code Selector
const MOCK_ALL_CODES = [
    "Billing Issues", "Cancellation Policy", "Class Schedule", "Cleanliness", "Competitor Comparison",
    "Customer Service", "Equipment Maintenance", "Facility Conditions", "Facility Layout",
    "Facility Upgrades", "Fees & Charges", "General Manager", "Gym Etiquette", "Locker Rooms",
    "Management Engagement", "Parking", "Personal Training", "Pool/Sauna", "Price/Value",
    "Safety / Organization", "Service Availability", "Staff Friendliness", "Staff Professionalism"
];

const MOCK_SUGGESTIONS = [
    { code: "Cleanliness", score: 98 },
    { code: "Locker Rooms", score: 85 },
    { code: "Facility Conditions", score: 72 }
];

const ALL_COMMENTS: CommentData[] = [
    {
        id: 1,
        text: "1- All new staff- very unfriendly greeting. Had to tell the front desk person the procedure for checking my son into the daycare and she acted pissed off that I would make her take the extra step 2- we apparently have a new GM? What happened to Chuck? Chuck was friendly, introduced himself, walked around. The 'new' GM did not acknowledge anyone coming in, going out, etc. 3 - My regular complaint about this ACMEs - not enough daycare hours. No daycare on friday afternoons (not cool), and now Saturday daycre doesnt open until 830, which means those of us with kids can't participate in the 815 am classes. 4- classrooms do not have AC - boot camp class is totally fun, but a lot of the sweat comes from the lack of AC/air circulation. yuck",
        sentiment: "Negative",
        codes: [
            { segment: "very unfriendly greeting", code: "Staff Friendliness", idea: "Staff greeting was unwelcoming" },
            { segment: "new GM did not acknowledge", code: "Management Engagement", idea: "General Manager fails to interact with members" },
            { segment: "not enough daycare hours", code: "Service Availability", idea: "Daycare hours are insufficient" },
            { segment: "classrooms do not have AC", code: "Facility Conditions", idea: "Lack of air conditioning in classrooms" },
            // Example uncoded segment for demo
            { segment: "boot camp class is totally fun", code: null, idea: "Positive feedback on class content despite AC issues" }
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

// -- ARCHITECTURE CHANGE: Detached Popover --
// Instead of wrapping each text segment in a Popover (which breaks lines),
// we manage ONE Popover per comment block and move it around to the active segment.

interface HighlightData {
    code: string | null;
    idea: string;
    segment: string;
}

// Interactive Component for each Highlight - Reverted to safer component architecture
// Helper type for coordinates
interface Rect {
    top: number;
    left: number;
    width: number;
    height: number;
}

const TextAnalysisBlock = ({
    text,
    codes,
    showAllHighlights,
    onEditCode
}: {
    text: string,
    codes?: Array<HighlightData>,
    showAllHighlights: boolean,
    onEditCode: (data: HighlightData) => void
}) => {
    // State to track which highlight is active
    const [activeHighlight, setActiveHighlight] = useState<HighlightData | null>(null);
    // State to track the coordinates of the active highlight for the "Ghost Activator"
    const [activeRect, setActiveRect] = useState<Rect | null>(null);

    // Timeout refs for smooth hover handling
    const openTimeout = useRef<any>();
    const closeTimeout = useRef<any>();

    const handleMouseEnterSegment = (event: any, data: HighlightData) => {
        // Interactivity is ALWAYS active for visible segments
        const rect = event.currentTarget.getBoundingClientRect();

        // Clear any pending close actions
        if (closeTimeout.current) clearTimeout(closeTimeout.current);

        // Small delay to prevent accidental triggers while scrolling/moving fast
        // But fast enough to feel responsive
        openTimeout.current = setTimeout(() => {
            setActiveRect({
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height
            });
            setActiveHighlight(data);
        }, 50);
    };

    const handleMouseLeaveSegment = () => {
        if (openTimeout.current) clearTimeout(openTimeout.current);

        // Delay closing to allow moving mouse into the popover
        closeTimeout.current = setTimeout(() => {
            setActiveHighlight(null);
            setActiveRect(null);
        }, 150);
    };

    const handleMouseEnterPopover = () => {
        if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };

    const handleMouseLeavePopover = () => {
        closeTimeout.current = setTimeout(() => {
            setActiveHighlight(null);
            setActiveRect(null);
        }, 150);
    };

    // --- Render Logic for Text Segments (PURE SPANS) ---
    const renderTextSegments = () => {
        if (!codes || codes.length === 0) return <span>{text}</span>;

        let segmentsToRender = showAllHighlights ? codes : [codes[0]];
        segmentsToRender = [...segmentsToRender].sort((a, b) => b.segment.length - a.segment.length);

        const pattern = segmentsToRender
            .map(c => c.segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
            .join('|');

        const regex = new RegExp(`(${pattern})`, 'gi');
        const parts = text.split(regex);

        return (
            <span style={{ lineHeight: '1.6' }}>
                {parts.map((part, i) => {
                    const matchedCode = segmentsToRender.find(c => c.segment.toLowerCase() === part.toLowerCase());
                    const isUncoded = matchedCode?.code === null;

                    // NEUTRAL COLORS - Updated
                    const highlightColor = isUncoded ? 'rgba(0, 0, 0, 0.05)' : 'rgba(200, 200, 200, 0.4)';
                    const borderColor = isUncoded ? '#babec3' : '#5c5f62';
                    const borderStyle = isUncoded ? 'dashed' : 'solid';

                    return matchedCode ? (
                        <span
                            key={i}
                            onMouseEnter={(e: any) => handleMouseEnterSegment(e, matchedCode)}
                            onMouseLeave={handleMouseLeaveSegment}
                            style={{
                                backgroundColor: highlightColor,
                                color: '#202223',
                                padding: '0 2px',
                                borderRadius: '2px',
                                fontWeight: '500',
                                borderBottom: `1px ${borderStyle} ${borderColor}`,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                position: 'relative',
                                display: 'inline', // Pure inline
                                whiteSpace: 'pre-wrap'
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

    // The Ghost Activator: An invisible absolute div that mimics the highlight's position
    // This allows the Popover to attach to "nothing" without wrapping the text in blocks.
    const activatorNode = activeRect ? (
        <div style={{
            position: 'fixed',
            top: activeRect.top,
            left: activeRect.left,
            width: activeRect.width,
            height: activeRect.height,
            pointerEvents: 'none', // Let clicks pass through if needed, though mostly covered by popover logic
            visibility: 'hidden' // Invisible anchor
        }} />
    ) : <div />; // Fallback

    return (
        <div>
            {/* 1. The Text Flow */}
            <Text as="p" variant="bodyMd">
                {renderTextSegments()}
            </Text>

            {/* 2. The Detached Popover with Ghost Activator */}
            {activeHighlight && activeRect && (
                <Popover
                    active={true}
                    activator={activatorNode}
                    onClose={() => {
                        setActiveHighlight(null);
                        setActiveRect(null);
                    }}
                    preferredAlignment="center"
                    preferredPosition="above"
                    zIndexOverride={6000}
                >
                    <div
                        onMouseEnter={handleMouseEnterPopover}
                        onMouseLeave={handleMouseLeavePopover}
                        style={{ padding: '16px', width: '280px' }}
                    >
                        <BlockStack gap="300">
                            {/* Code Section */}
                            <div>
                                <Text as="p" variant="bodyXs" tone="subdued" fontWeight="medium">Code</Text>
                                {activeHighlight.code === null ? (
                                    <Text as="p" variant="bodySm" tone="subdued" fontWeight="regular">No code assigned</Text>
                                ) : (
                                    <Text as="p" variant="bodySm" fontWeight="bold">{activeHighlight.code}</Text>
                                )}
                            </div>

                            {/* Idea Section */}
                            <div>
                                <Text as="p" variant="bodyXs" tone="subdued" fontWeight="medium">Idea</Text>
                                <Text as="p" variant="bodySm">{activeHighlight.idea}</Text>
                            </div>

                            {/* Footer Action */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                                <Button
                                    variant="plain"
                                    size="slim"
                                    icon={activeHighlight.code === null ? undefined : EditIcon}
                                    onClick={() => {
                                        setActiveRect(null);
                                        setActiveHighlight(null);
                                        onEditCode(activeHighlight);
                                    }}
                                >
                                    {activeHighlight.code === null ? 'Add Code' : 'Edit'}
                                </Button>
                            </div>
                        </BlockStack>
                    </div>
                </Popover>
            )}
        </div>
    );
};


export function ResponseDrawerV3({ isOpen, onClose }: ResponseDrawerProps) {
    const [selectedTab, setSelectedTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    // Global Toggle State
    const [showHighlights, setShowHighlights] = useState(false);

    // Modal State
    const [editingHighlight, setEditingHighlight] = useState<HighlightData | null>(null);
    const [modalSearch, setModalSearch] = useState('');
    const [selectedCode, setSelectedCode] = useState<string | null>(null);

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

    // Filter codes for modal
    const filteredAllCodes = useMemo(() => {
        if (!modalSearch.trim()) return MOCK_ALL_CODES;
        return MOCK_ALL_CODES.filter(c => c.toLowerCase().includes(modalSearch.toLowerCase()));
    }, [modalSearch]);

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
                <div style={{ paddingRight: '16px' }}>
                    <Text as="h2" variant="headingMd">Response Drawer (V3 - Global Toggle)</Text>
                </div>

                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <Button
                        icon={XIcon}
                        variant="plain"
                        onClick={onClose}
                        accessibilityLabel="Close"
                    />
                </div>
            </div>

            {/* List View Only */}
            <>
                <div style={{ padding: '0 16px', borderBottom: '1px solid #e1e3e5' }}>
                    <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange} />
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    <BlockStack gap="400">
                        {/* Search Toolbar */}
                        <div style={{ marginBottom: '12px' }}>
                            <div style={{ marginBottom: '8px' }}>
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

                            {/* Custom Toggle Switch + Inline Legend */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                {/* Clickable Toggle Area */}
                                <div
                                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px' }}
                                    onClick={() => setShowHighlights(!showHighlights)}
                                >
                                    {/* Switch Track */}
                                    <div style={{
                                        width: '36px',
                                        height: '20px',
                                        borderRadius: '20px',
                                        backgroundColor: showHighlights ? '#108043' : '#dbe1e6',
                                        position: 'relative',
                                        transition: 'background-color 0.2s',
                                        flexShrink: 0
                                    }}>
                                        <div style={{
                                            width: '16px',
                                            height: '16px',
                                            borderRadius: '50%',
                                            backgroundColor: 'white',
                                            position: 'absolute',
                                            top: '2px',
                                            left: showHighlights ? '18px' : '2px',
                                            transition: 'left 0.2s',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                        }} />
                                    </div>

                                    {/* Label */}
                                    <Text as="span" variant="bodySm" fontWeight="medium" tone="subdued">
                                        View all response analysis
                                    </Text>
                                </div>

                                {/* Inline Legend - Visible only when Analysis Mode is ON */}
                                {showHighlights && (
                                    <div style={{ display: 'flex', gap: '12px', animation: 'fadeIn 0.3s ease-in-out' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div style={{
                                                width: '10px',
                                                height: '10px',
                                                borderRadius: '50%',
                                                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                                border: '1px dashed #babec3'
                                            }} />
                                            <Text as="span" variant="bodyXs" tone="subdued">Uncoded</Text>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div style={{
                                                width: '10px',
                                                height: '10px',
                                                borderRadius: '50%',
                                                backgroundColor: 'rgba(200, 200, 200, 0.4)',
                                                border: '1px solid #5c5f62'
                                            }} />
                                            <Text as="span" variant="bodyXs" tone="subdued">Coded</Text>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {filteredComments.length > 0 ? (
                            filteredComments.map((comment) => (
                                <div
                                    key={comment.id}
                                    style={{
                                        padding: '20px 0',
                                        borderBottom: '1px solid #f1f2f3',
                                    }}
                                >
                                    <div style={{ marginBottom: '8px' }}>
                                        <Text as="p" variant="bodyMd">
                                            <span style={{ fontWeight: '600', marginRight: '4px' }}>{comment.id}.</span>
                                        </Text>

                                        {/* Usage of the new Block Component */}
                                        <TextAnalysisBlock
                                            text={comment.text}
                                            codes={comment.codes}
                                            showAllHighlights={showHighlights}
                                            onEditCode={(highlight) => {
                                                setEditingHighlight(highlight);
                                                setSelectedCode(highlight.code);
                                                setModalSearch('');
                                            }}
                                        />
                                    </div>

                                    <div
                                        style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}
                                    >
                                        <Button variant="plain" onClick={() => console.log('Open full metadata detail')}>View Metadata</Button>
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
            {/* Code Selector Modal */}
            {editingHighlight && (
                <Modal
                    open={true}
                    onClose={() => setEditingHighlight(null)}
                    title={`Select Code for "${editingHighlight.segment}"`}
                    primaryAction={{
                        content: 'Apply',
                        onAction: () => {
                            console.log('Applied Code:', selectedCode, 'to segment:', editingHighlight.segment);
                            setEditingHighlight(null);
                        },
                    }}
                    secondaryActions={[
                        {
                            content: 'Cancel',
                            onAction: () => setEditingHighlight(null),
                        },
                    ]}
                    sectioned
                >
                    <div style={{ padding: '16px 0' }}>
                        <TextField
                            label="Search codes"
                            labelHidden
                            value={modalSearch}
                            onChange={(val) => setModalSearch(val)}
                            placeholder="Search suggestions..."
                            prefix={<Icon source={SearchIcon} />}
                            autoComplete="off"
                            autoFocus
                        />
                        <div style={{ marginTop: '16px', height: '300px', overflowY: 'auto', border: '1px solid #e1e3e5', borderRadius: '4px' }}>
                            {/* Suggestions Section */}
                            <div style={{ padding: '8px 12px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e1e3e5' }}>
                                <Text as="p" variant="bodyXs" fontWeight="bold" tone="subdued">SUGGESTIONS</Text>
                            </div>
                            {MOCK_SUGGESTIONS
                                .filter(s => s.code.toLowerCase().includes(modalSearch.toLowerCase()))
                                .map((s, i) => {
                                    const isSelected = selectedCode === s.code;
                                    return (
                                        <div
                                            key={`s-${i}`}
                                            style={{
                                                padding: '10px 12px',
                                                borderBottom: '1px solid #f1f2f3',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                backgroundColor: isSelected ? '#f1f8f5' : 'transparent',
                                                transition: 'background 0.2s',
                                                alignItems: 'center'
                                            }}
                                            onMouseEnter={(e: any) => { if (!isSelected) e.currentTarget.style.backgroundColor = '#f4f6f8'; }}
                                            onMouseLeave={(e: any) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                            onClick={() => setSelectedCode(s.code)}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Text as="span" fontWeight={isSelected ? "bold" : "medium"} tone="magic">{s.code}</Text>
                                            </div>
                                            <Text as="span" tone="success">{s.score}%</Text>
                                        </div>
                                    )
                                })}

                            {/* All Codes Section */}
                            <div style={{ padding: '8px 12px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e1e3e5', borderTop: '1px solid #e1e3e5' }}>
                                <Text as="p" variant="bodyXs" fontWeight="bold" tone="subdued">ALL CODES</Text>
                            </div>
                            {filteredAllCodes.map((code, i) => {
                                const isSelected = selectedCode === code;
                                return (
                                    <div
                                        key={i}
                                        style={{
                                            padding: '10px 12px',
                                            borderBottom: '1px solid #f1f2f3',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s',
                                            backgroundColor: isSelected ? '#f1f8f5' : 'transparent',
                                        }}
                                        onMouseEnter={(e: any) => { if (!isSelected) e.currentTarget.style.backgroundColor = '#f4f6f8'; }}
                                        onMouseLeave={(e: any) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                        onClick={() => setSelectedCode(code)}
                                    >
                                        <Text as="span" fontWeight={isSelected ? "bold" : "regular"}>{code}</Text>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

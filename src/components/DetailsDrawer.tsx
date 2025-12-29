import { BlockStack, Text, Button, Tabs, TextField, Icon } from '@shopify/polaris';
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { XIcon, ArrowLeftIcon, SendIcon, SearchIcon, ExportIcon } from '@shopify/polaris-icons';

interface DetailsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    details?: any;
}


// Mock Data moved outside to ensure stable reference
const ALL_COMMENTS = [
    {
        id: 1,
        text: "1- All new staff- very unfriendly greeting. Had to tell the front desk person the procedure for checking my son into the daycare and she acted pissed off that I would make her take the extra step 2- we apparently have a new GM? What happened to Chuck? Chuck was friendly, introduced himself, walked around. The 'new' GM did not acknowledge anyone coming in, going out, etc. 3 - My regular complaint about this ACMEs - not enough daycare hours. No daycare on friday afternoons (not cool), and now Saturday daycre doesnt open until 830, which means those of us with kids can't participate in the 815 am classes. 4- classrooms do not have AC - boot camp class is totally fun, but a lot of the sweat comes from the lack of AC/air circulation. yuck",
        sentiment: "Negative",
        highlights: ["very unfriendly greeting"]
    },
    {
        id: 8,
        text: "here are the things that you need to consider: 1. gym is very dirty, trash is everywhere, papers and plastic bottles are on the floor 2. most machines and equipments are not working especially the stairclimbers on the 2nd floor, equipments are so filthy and full of sweat, no one is cleaning them. sometimes i dont want to even want to use them coz of all the dust and sweat. 3.bathroom and lockers are so dirty, hairs and water is everywhere, some cubicle for chaning are not working properly, toliets and sink are filthy and so smelly. 4. weight and dumbells are everywhere, they are even on the side of the running track and they are very dangerous to the memebers who are running. no one of the staffs would take them out from the track and put them on their right places. i already told some of the staffs about it and they just ignored my complaints. 5. the rubber mats in the aerobics room are so dirty, filthy, torn to small pieces. aerobics ball are deflated, dumbells are so filthy and smells so bad. 6. club should put a stall of paper towels to eery corner of the gym so members can wipe the equipment after using them. 7. staff should be friendly and approachable at all times, sometimes you ask for some favors and they will not do anything.",
        sentiment: "Negative",
        highlights: ["gym is very dirty"]
    },
    {
        id: 9,
        text: "I AM EXTREMELY DISATISFIED BY THE DECEIVING BILLING PRACTICES OF ACME'S FITNESS CENTERS CORPORATE OFFICES. I HAVE HAD PROBLEMS WITH MY BILLING SINCE THE FIRST MONTH I SIGN UP, AND BY READING IN THE INTERNET, THERE ARE MANY OTHERS WITH THE SAME COMPLAIN. I USE THE CLUB MAINLY FOR THE SWIMMING POOL AND THE STEAM ROOM. BOTH OF THESE NEED A COMPLETE REMODELING, UPGRADE AND UPKEEPING. WERE IT NOT BECAUSE MY OWN SWIMMING POOL IS BEEING REPAIRED RIGHT NOW AND BECAUSE OF THE FRIENDLINESS OF YOUR CLUB MANAGER CARLOS, I WILL CANCEL MY SUBSCRIPTION WHICH I AM PLANNING TO DO AS SOON AS MY POOL IS FINISHED UNLESS SOMETHING IS DONE ABOUT MY OBJECTIONS.",
        sentiment: "Negative",
        highlights: ["DECEIVING BILLING PRACTICES"]
    },
    {
        id: 2,
        text: "Being an overweight person, I was totally scared to join, but the staff made me feel comfortable and I love the women's section!",
        sentiment: "Positive",
        highlights: ["staff made me feel comfortable"]
    }
];

// Helper to render text with highlights
const HighlightedText = ({ text, highlights }: { text: string, highlights?: string[] }) => {
    if (!highlights || highlights.length === 0) return <span>{text}</span>;

    // Create a regex to match any of the highlight phrases
    // Escape special regex characters in the highlights
    const escapedHighlights = highlights.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escapedHighlights.join('|')})`, 'gi');

    // Split the text by the regex
    const parts = text.split(regex);

    return (
        <span style={{ lineHeight: '1.6' }}>
            {parts.map((part, i) => {
                const isHighlight = highlights.some(h => h.toLowerCase() === part.toLowerCase());
                return isHighlight ? (
                    <span
                        key={i}
                        style={{
                            backgroundColor: 'rgba(69, 79, 91, 0.12)', // Neutral Grey Highlight
                            color: '#202223',
                            padding: '2px 4px',
                            margin: '0 -2px',
                            borderRadius: '4px',
                            fontWeight: '500' // Slightly bolder to help visibility
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

export function DetailsDrawer({ isOpen, onClose, title }: DetailsDrawerProps) {
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedComment, setSelectedComment] = useState<any>(null);

    // Chat State
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, sender: 'system', text: 'Hello! I analyzed the data for this category. Ask me anything to dig deeper.' }
    ]);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Search State
    const [searchQuery, setSearchQuery] = useState('');

    const handleTabChange = useCallback(
        (selectedTabIndex: number) => setSelectedTab(selectedTabIndex),
        [],
    );

    // Memoized Filtering Logic for high performance and stability
    const filteredComments = useMemo(() => {
        if (!searchQuery.trim()) return ALL_COMMENTS;

        const lowerQuery = searchQuery.toLowerCase();
        return ALL_COMMENTS.filter(comment =>
            comment.text.toLowerCase().includes(lowerQuery)
        );
    }, [searchQuery]);

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;

        // Add user message
        const newUserMsg = { id: Date.now(), sender: 'user', text: chatInput };
        setMessages(prev => [...prev, newUserMsg]);
        setChatInput('');

        // Mock AI Response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'system',
                text: `Here is an insight based on "${newUserMsg.text}": The data suggests a correlation with staffing issues during weekend shifts.`
            }]);
        }, 1000);
    };

    const tabs = [
        {
            id: 'open-ends',
            content: 'Responses',
            accessibilityLabel: 'Open Ends',
            panelID: 'open-ends-panel',
        },
        {
            id: 'closed-ends',
            content: 'Closed Ends',
            accessibilityLabel: 'Closed Ends',
            panelID: 'closed-ends-panel',
        },
        {
            id: 'ask',
            content: 'Ask',
            accessibilityLabel: 'Ask AI',
            panelID: 'ask-panel',
        },
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
            // Animation would be handled by CSS class or Transition group in a real app
        }}>
            {/* Conditional Header */}
            <div style={{
                padding: '20px',
                borderBottom: '1px solid #e1e3e5',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center', // Center vertically
                backgroundColor: '#f9fafb',
                minHeight: '80px' // Ensure consistent height
            }}>
                {selectedComment ? (
                    // Detail Header
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Button icon={ArrowLeftIcon} onClick={() => setSelectedComment(null)} />
                        <div>
                            <Text as="h2" variant="headingMd">Response #{selectedComment.id}</Text>
                        </div>
                    </div>
                ) : (
                    // Main Header
                    <div style={{ paddingRight: '16px' }}>
                        <Text as="h2" variant="headingMd">{title || 'Details'}</Text>
                        <div style={{ marginTop: '4px' }}>
                            <Text as="p" tone="subdued" variant="bodySm">17 Responses</Text>
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {!selectedComment && (
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

            {/* Content Area - Toggle between List and Details */}
            {selectedComment ? (
                // Drill-down Detail View
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px', backgroundColor: '#fff' }}>
                    <BlockStack gap="500">
                        {/* Comment Text Itself */}
                        <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e1e3e5' }}>
                            <Text as="h3" variant="headingXs">Comment</Text>
                            <div style={{ marginTop: '8px' }}>
                                <Text as="p" variant="bodyMd">
                                    <HighlightedText text={selectedComment.text} highlights={selectedComment.highlights} />
                                </Text>
                            </div>
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


                        {/* Metadata - Vertical Stack for Long Data Support */}
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
                                    {/* Example of very long content */}
                                    <div>
                                        <Text as="p" tone="subdued" variant="bodyXs">Landing Page URL</Text>
                                        <div style={{ wordBreak: 'break-word' }}>
                                            <Text as="p" variant="bodyMd">https://www.acme-fitness.com/campaigns/summer-special/landing?ref=google_ads&source=email_blast_v2</Text>
                                        </div>
                                    </div>
                                </BlockStack>
                            </BlockStack>
                        </div>


                    </BlockStack>
                </div>
            ) : (
                // Main List View (Tabs + Content)
                <>
                    <div style={{ padding: '0 16px', borderBottom: '1px solid #e1e3e5' }}>
                        <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange} />
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                        {selectedTab === 0 ? (
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
                                            onClick={() => setSelectedComment(comment)}
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
                                                    <HighlightedText text={comment.text} highlights={comment.highlights} />
                                                </Text>
                                            </div>
                                            <Button variant="plain">View details</Button>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                                        <Text as="p" tone="subdued">No responses match your search.</Text>
                                        <Button variant="plain" onClick={() => setSearchQuery('')}>Clear search</Button>
                                    </div>
                                )}
                            </BlockStack>
                        ) : selectedTab === 1 ? (
                            <BlockStack gap="500">
                                {/* Mock Data based on User Images */}
                                {[
                                    {
                                        groupTitle: "NPS Categories",
                                        items: [
                                            { label: "Promoters: 4% (34/383)", value: 75, color: "#454f5b" }, // Dark Gray
                                            { label: "Detractors: 3.8% (33/861)", value: 70, color: "#919eab" }, // Light Gray
                                            { label: "Passives: 2% (17/412)", value: 40, color: "#919eab" }
                                        ]
                                    },
                                    {
                                        groupTitle: "_Week_Date_",
                                        items: [
                                            { label: "8/1/2011: 5.2% (27/521)", value: 85, color: "#454f5b" },
                                            { label: "8/8/2011: 4.4% (23/399)", value: 70, color: "#637381" },
                                            { label: "8/15/2011: 2.5% (13/340)", value: 40, color: "#919eab" },
                                            { label: "8/22/2011: 2.5% (13/243)", value: 40, color: "#c4cdd5" },
                                            { label: "8/29/2011: 1.5% (8/153)", value: 25, color: "#dfe3e8" }
                                        ]
                                    },
                                    {
                                        groupTitle: "NPS",
                                        items: [
                                            { label: "10: 12.3% (27/220)", value: 95, color: "#454f5b" },
                                            { label: "8: 5% (11/220)", value: 35, color: "#637381" },
                                            { label: "3: 3.2% (7/108)", value: 22, color: "#919eab" },
                                            { label: "5: 3.2% (7/198)", value: 22, color: "#919eab" },
                                            { label: "6: 3.2% (7/147)", value: 22, color: "#919eab" },
                                            { label: "9: 3.2% (7/163)", value: 22, color: "#919eab" },
                                            { label: "7: 2.7% (6/192)", value: 18, color: "#c4cdd5" }
                                        ]
                                    }
                                ].map((group, groupIndex) => (
                                    <div key={groupIndex}>
                                        <Text as="h3" variant="headingSm">{group.groupTitle}</Text>
                                        <div style={{
                                            marginTop: '8px',
                                            borderLeft: '2px solid #dbe1e6', // The grey vertical line from the image
                                            paddingLeft: '12px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '8px'
                                        }}>
                                            {group.items.map((item, i) => (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {/* The Bar */}
                                                    <div style={{
                                                        height: '16px',
                                                        backgroundColor: item.color,
                                                        width: `${item.value}%`, // Using mock percentage for visual width
                                                        borderRadius: '2px',
                                                        minWidth: '2px'
                                                    }} />
                                                    {/* The Label */}
                                                    <div style={{ flexShrink: 0 }}>
                                                        <Text as="span" variant="bodyXs" tone="subdued">
                                                            {item.label}
                                                        </Text>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {/* Summary Across Questions Section */}
                                <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e1e3e5' }}>
                                    <Text as="h3" variant="headingSm">Summary across questions</Text>
                                    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {/* Flattening the mock data to creating a summary list similar to the image */}
                                        {[
                                            "NPS: 10: 12.3% (27/220)",
                                            "_Week_Date_: 8/1/2011: 5.2% (27/521)",
                                            "NPS: 8: 5% (11/220)",
                                            "_Week_Date_: 8/8/2011: 4.4% (23/399)",
                                            "NPS Categories: Promoters: 4% (34/383)",
                                            "NPS Categories: Detractors: 3.8% (33/861)",
                                            "NPS: 3: 3.2% (7/108)",
                                            "NPS: 5: 3.2% (7/198)",
                                            "NPS: 6: 3.2% (7/147)",
                                            "NPS: 9: 3.2% (7/163)",
                                            "NPS: 7: 2.7% (6/192)",
                                            "_Week_Date_: 8/15/2011: 2.5% (13/340)",
                                            "_Week_Date_: 8/22/2011: 2.5% (13/243)"
                                        ].map((summaryItem, index) => (
                                            <div key={index} style={{
                                                padding: '8px 0',
                                                borderBottom: '1px solid #f1f2f3',
                                                fontSize: '13px',
                                                color: '#454f5b' // Neutral dark gray
                                            }}>
                                                {summaryItem}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </BlockStack>
                        ) : (
                            // ASK TAB (Chat Interface)
                            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                {/* Messages Area */}
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '20px' }}>
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            style={{
                                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                                maxWidth: '85%',
                                                backgroundColor: msg.sender === 'user' ? '#454f5b' : '#f4f6f8',
                                                color: msg.sender === 'user' ? '#fff' : '#202223',
                                                padding: '12px 16px',
                                                borderRadius: '16px',
                                                borderBottomRightRadius: msg.sender === 'user' ? '4px' : '16px',
                                                borderBottomLeftRadius: msg.sender === 'system' ? '4px' : '16px',
                                                fontSize: '14px',
                                                lineHeight: '1.5',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                            }}
                                        >
                                            {msg.text}
                                        </div>
                                    ))}
                                    {/* Invisible element to auto-scroll to */}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area */}
                                <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', gap: '8px' }}>
                                    <div style={{ flex: 1 }}>
                                        <TextField
                                            label="Chat Input"
                                            labelHidden
                                            value={chatInput}
                                            onChange={(val) => setChatInput(val)}
                                            placeholder="Ask a question about this data..."
                                            autoComplete="off"
                                        />
                                    </div>
                                    <Button icon={SendIcon} onClick={handleSendMessage} variant="primary" />
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}


        </div>
    );
}

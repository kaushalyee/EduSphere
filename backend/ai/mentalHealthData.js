module.exports = {
  intents: [
    {
      tag: "greeting",
      patterns: [
        "hello", "hi", "hey", "is anyone there?", "hi there", 
        "good morning", "good evening", "kohomada", 
        "hello bot", "hey friend"
      ],
      responses: [
        "Hello! I'm here to listen. How are you feeling today?",
        "Hi there! You can talk to me about whatever is on your mind. How has your day been?",
        "Ayubowan! I'm EduSphere's mental health assistant. What's bothering you lately?",
        "Hey! It's good to hear from you. Do you want to talk about your studies or something else?",
        "Hello. I understand university life can be tough. I'm here for you. How are things?"
      ],
      followUp: "Would you like to share what's on your mind today?"
    },
    {
      tag: "exam_stress",
      patterns: [
        "I am so stressed about exams", "I might fail my finals", "my A/Ls are killing me",
        "exam pressure is too much", "I'm scared of the upcoming test", "I can't remember anything for the exam",
        "semester finals are stressing me out", "I have too much to study", "I'm going to fail my degree",
        "panic about exams",
        "stressed bro", "so stressed man", "exams killing me", "cant handle exams", "papers are stressing me out", "I'm cooked for exams", "tests are killing me", "I'm gonna fail"
      ],
      responses: [
        "Exam season is incredibly stressful, especially with university expectations. Take a deep breath. Try breaking your syllabus into smaller, manageable chunks.",
        "It's completely normal to feel overwhelmed right now. Remember that an exam doesn't define your entire future. Have you tried studying in short Pomodoro sessions?",
        "I hear you. The pressure to get good grades can feel very heavy. Make sure you're still drinking water, eating well, and maybe join a 'Kuppi' session with friends.",
        "That fear of failing is really tough to sit with. Try writing down exactly what topics worry you the most, and tackle just the first one today. You can do this.",
        "It sounds like you're carrying a lot of academic weight. Please don't forget to take short breaks. A clear mind retains information much better than a panicked one."
      ],
      followUp: "Are you managing to take small breaks between your study sessions?"
    },
    {
      tag: "anxiety",
      patterns: [
        "I feel anxious", "I am having a panic attack", "my heart is beating fast",
        "I'm constantly worried", "feeling nervous all the time", "I have severe anxiety",
        "I can't calm down", "I feel like something bad will happen", "butterflies in my stomach",
        "I'm so worried about everything",
        "feeling anxious bro", "so nervous man", "cant stop worrying", "heart is racing", "I'm panicking", "everything feels overwhelming", "I cant breathe properly"
      ],
      responses: [
        "I'm so sorry you're feeling this way right now. Let's do a quick grounding exercise: name 5 things you can see around you right now.",
        "Anxiety can feel terrifying, but you are safe here. Try to take a slow, deep breath in for 4 seconds, hold for 4, and exhale for 4.",
        "It sounds like your mind is racing. Let's try to slow things down. Focus on the physical feeling of your feet touching the floor. You are grounded.",
        "Feeling constantly nervous is exhausting. It's okay to step away from whatever is triggering you right now and just rest in a quiet place.",
        "That sounds really difficult to deal with alone. Please remember this feeling will pass. Sip some cold water and try to focus on taking steady breaths."
      ],
      followUp: "Are you feeling grounded right now, or do you need another breathing technique?"
    },
    {
      tag: "depression",
      patterns: [
        "I feel depressed", "I am so sad", "everything is hopeless", 
        "I feel empty inside", "crying for no reason", "I feel worthless",
        "life has no meaning", "I can't stop crying", "I am miserable", 
        "nothing makes me happy anymore",
        "feeling down", "feeling low", "I feel empty", "nothing makes me happy", "I don't feel anything", "life feels pointless", "I cry a lot", "feeling blue", "I'm not okay"
      ],
      responses: [
        "I am so sorry you're carrying this heavy sadness. It takes a lot of strength to admit you are struggling, and I'm proud of you for sharing this.",
        "Feeling empty and hopeless is truly exhausting. Please know that this doesn't mean you are broken. Have you considered speaking to the university counselor?",
        "It's okay to cry and let it out. You don't have to pretend everything is fine. Take it one small step at a time, even if it's just getting out of bed.",
        "When depression hits, even the smallest tasks feel impossible. Please be gentle with yourself today. You are worthy of care and support.",
        "I hear how much pain you are in. You are not alone in this, and things can get better. Consider talking to a trusted doctor or a professional who can genuinely help."
      ],
      followUp: "Would you be open to speaking with a campus counselor or doctor about these feelings?"
    },
    {
      tag: "loneliness",
      patterns: [
        "I feel so lonely", "I have no friends", "no one understands me",
        "I feel isolated", "everyone is ignoring me", "I have nobody to talk to",
        "I'm all alone in campus", "hostel life is lonely", "I feel left out",
        "I wish I had friends",
        "I feel so alone bro", "nobody cares about me", "I have no one", "everyone ignores me", "no one understands me man"
      ],
      responses: [
        "Being away from home or feeling like you don't fit in can be incredibly isolating. Your feelings are valid, and I'm here listening to you right now.",
        "University life can seem like everyone else has it figured out, but many students feel exactly the same way you do. You are not alone in feeling this way.",
        "It hurts when you feel misunderstood or left out. Maybe try joining a small club or a study group where people share similar interests.",
        "I hear you. Moving to a new place or living in a boarding house away from family is a huge adjustment. Take your time finding your crowd.",
        "Loneliness is a very heavy feeling. You matter, and your presence is important. Sometimes starting with a simple 'hello' to a classmate can be a good first step."
      ],
      followUp: "Is there a club or society on campus that you've been thinking about joining?"
    },
    {
      tag: "motivation_loss",
      patterns: [
        "I have no motivation", "I feel so lazy", "I don't want to study",
        "I'm giving up", "I can't focus on anything", "no energy to do work",
        "procrastinating everything", "lost all my drive", "can't bring myself to study",
        "I feel stuck",
        "I don't want to do anything", "I can't be bothered", "no motivation bro", "feeling lazy", "I give up", "what's the point", "I don't care anymore"
      ],
      responses: [
        "Losing motivation is usually a sign that you are overwhelmed, not lazy. Try setting a timer for just 5 minutes of work. Just 5 minutes.",
        "It is completely okay to have unmotivated days. Your brain might need a break. Step away from your books, take a walk, and come back refreshed.",
        "When the workload is massive, it paralyzes you. Break your biggest task into a very small, silly step, like just opening the textbook.",
        "You might be experiencing academic fatigue. Don't be too hard on yourself. Reward yourself for small accomplishments instead of focusing on the mountain of work.",
        "I understand. Feeling 'stuck' is incredibly frustrating. Maybe changing your study environment—like moving to a library or a café—might spark some energy."
      ],
      followUp: "What is one very small task you might be able to manage right now?"
    },
    {
      tag: "burnout",
      patterns: [
        "I'm completely exhausted", "overwhelmed with work", "I can't cope anymore",
        "too many assignments", "burning out", "I have no energy left",
        "tired of studying", "everything is too much", "I'm physically and mentally drained",
        "pushing myself too hard",
        "I'm so tired of everything", "I can't do this anymore", "too much on my plate", "I'm exhausted bro", "I need a break", "mentally drained"
      ],
      responses: [
        "It sounds like you've pushed yourself far past your limits. Please stop working right now. Your mind and body desperately need rest to recover.",
        "Burnout is your body's way of forcing you to pause. University culture normalizes overworking, but your health must come first. Sleep.",
        "I hear how overwhelmed you are. You cannot pour from an empty cup. It's time to communicate with your lecturers if you need an extension.",
        "This level of exhaustion means you need an actual break—no thinking about assignments, no guilt. Give yourself permission to disconnect completely today.",
        "You are carrying way too much right now. Identify the things that absolutely must be done, and let go of the rest for now. Rest is productive."
      ],
      followUp: "Can you set aside your work for the rest of the day and just rest?"
    },
    {
      tag: "sleep_problems",
      patterns: [
        "I can't sleep", "insomnia", "sleeping too much",
        "always tired", "can't wake up in the morning", "my sleep schedule is ruined",
        "staying up late studying", "nightmares", "bad sleep quality",
        "I feel tired all day",
        "can't sleep man", "up all night", "insomnia bro", "I keep waking up", "I sleep too much", "no energy"
      ],
      responses: [
        "Sleep issues make everything else feel much harder. Try to step away from screens at least an hour before bed and do something relaxing.",
        "If your mind is racing at night, try keeping a notebook by your bed. Write down all your worries so they aren't trapped in your head while you try to sleep.",
        "A ruined sleep schedule is common in university, but it takes a toll on your mental health. Try waking up at the exact same time every day, even weekends.",
        "Sleeping too much can be a sign of depression or burnout. Treat yourself with compassion. Try getting some sunlight first thing in the morning.",
        "It sounds like your body is struggling to find a rhythm. A warm shower or reading a book before bed might signal to your brain that it's time to shut down."
      ],
      followUp: "How many hours of sleep have you been getting on average recently?"
    },
    {
      tag: "family_pressure",
      patterns: [
        "my parents are putting pressure on me", "family expectations are too high", "arguing with my parents",
        "Amma and Thaththa want me to be an engineer", "they don't understand my stress", "family conflicts",
        "they only care about my grades", "I'm a disappointment to my family", "pressure to perform well",
        "they are comparing me to others",
        "parents are pressuring me", "family expects too much", "mum keeps pushing me", "dad is angry at my grades", "family stress bro", "parents pressure me too much"
      ],
      responses: [
        "I understand. In our culture, parental expectations can be an incredibly heavy burden. It hurts when it feels like their love is conditional on your grades.",
        "It's so hard when your family doesn't see how much you're struggling. Remember that your path belongs to you, not them, even if it causes friction right now.",
        "Being compared to cousins or friends is very painful. You are your own person with unique strengths. Please don't let their comparisons define your worth.",
        "It sounds like you need to set some boundaries, which is tough to do with parents. Try explaining to them gently that the pressure is making it harder to study.",
        "You are not a disappointment. You are doing your best in a highly demanding environment. Your mental wellbeing is far more important than any degree or ranking."
      ],
      followUp: "Do you think you can have an open conversation with them about how this affects you?"
    },
    {
      tag: "relationship_problems",
      patterns: [
        "I had a breakup", "my partner cheated on me", "fighting with my best friend",
        "trust issues", "relationship is toxic", "feeling abandoned by my girlfriend",
        "missing my boyfriend", "we stopped talking", "heartbroken",
        "friendship problems"
      ],
      responses: [
        "Heartbreak and relationship conflicts are incredibly painful, especially while trying to keep up with university. It's okay to grieve this loss.",
        "It is totally normal to feel shattered right now. Give yourself time and space away from the person to heal. Don't rush your recovery.",
        "I'm sorry you are dealing with this. Toxicity or broken trust can take a huge mental toll. Prioritize your own peace and well-being right now.",
        "Losing a friend or a partner disrupts your entire routine. Surround yourself with other supportive people and engage in activities that make you feel good.",
        "It hurts deeply right now, but this pain won't last forever. Take it one day at a time, and remember that you deserve to be treated with love and respect."
      ],
      followUp: "Do you have another trusted friend or family member you can rely on right now?"
    },
    {
      tag: "self_confidence",
      patterns: [
        "I have low self esteem", "I feel stupid", "not good enough",
        "imposter syndrome", "everyone is smarter than me", "I hate myself",
        "I lack confidence", "failed again", "feeling inferior",
        "I can't do anything right",
        "I'm not smart enough", "everyone is better than me", "I feel like a failure bro"
      ],
      responses: [
        "It is very common to experience imposter syndrome, especially in a competitive academic environment. You belong here just as much as anyone else.",
        "When you fail at something, the brain likes to say 'I am a failure.' But failing a test doesn't make you a failure. You are growing and learning.",
        "Please don't be so harsh on yourself. The fact that you are trying proves your resilience. Speak to yourself as you would a good friend.",
        "You are absolutely good enough. Stop comparing your behind-the-scenes struggles to everyone else's highlight reels. Everyone struggles.",
        "It hurts to feel inferior, but a lot of what you see in others is just presentation. Focus only on your own progress and the small wins you make each day."
      ],
      followUp: "Can you think of one thing, no matter how small, that you did well this week?"
    },
    {
      tag: "anger",
      patterns: [
        "I feel angry", "so frustrated right now", "I'm irritated by everything",
        "rage", "my temper is out of control", "screaming",
        "annoyed at the system", "lecturers make me mad", "I want to break things",
        "feeling aggressive"
      ],
      responses: [
        "Anger is a very valid emotion and often a sign of underlying stress or injustice. It's okay to feel this way. Let's take a slow breath.",
        "I can hear how frustrated you are. Sometimes the academic system or certain situations feel completely unfair. Do you want to vent? I'm listening.",
        "When rage builds up, you need a safe physical release. Taking a brisk walk, hitting a pillow, or doing a quick workout can genuinely help clear your head.",
        "It sounds like you're carrying a lot of irritation. Try stepping away from whatever triggered you for just 10 minutes to let your adrenaline drop.",
        "Your feelings are completely justified. Write down exactly what's making you so angry—getting it out of your head onto paper can reduce its power."
      ],
      followUp: "Would it help to type out everything that's making you angry right now?"
    },
    {
      tag: "homesickness",
      patterns: [
        "I miss home", "missing my family", "feeling out of place here",
        "I want to go back home", "hostel is not home", "I miss my mom's food",
        "feeling lost in the city", "I miss my village", "crying because I miss home",
        "university life is too different"
      ],
      responses: [
        "It's entirely natural to miss the comfort and safety of home, especially when things get tough. Moving away for university is a massive transition.",
        "Missing your family and home-cooked meals is so tough. Have you had a chance to call them lately? Hearing their voices might bring you some comfort.",
        "Feeling out of place in a new city or hostel can make the world feel very large and cold. Give yourself grace as you adjust; it takes time to build a new home.",
        "It's okay to be sad about missing home. Try keeping a familiar object or photos nearby, and establish a small comforting routine in your new space.",
        "I hear you. The transition from home life to campus life is jarring. Remember why you started this journey, and know that it gets a bit easier over time."
      ],
      followUp: "Are you planning to call your family or visit them soon?"
    },
    {
      tag: "financial_stress",
      patterns: [
        "I have money problems", "can't afford rent", "financial pressure",
        "how to pay my hostel fees", "Mahapola is delayed", "struggling with finances",
        "I need a part time job", "parents can't afford this", "I'm broke",
        "stressing over money"
      ],
      responses: [
        "Financial stress is incredibly paralyzing and makes it very hard to focus on studies. I'm sorry you are bearing this weight right now.",
        "It is immensely stressful when Mahapola or funds are delayed. Please consider reaching out to student welfare services; they sometimes offer emergency support.",
        "Knowing your parents are struggling to pay fees is a heavy emotional burden. You are doing your best. Look into university bursaries or part-time campus gigs.",
        "Money worries can cause severe anxiety. Don't carry this entirely alone. Talk to a trusted lecturer or the student counselor; they often know of resources.",
        "I hear how much this is impacting you. Focus on covering your basic needs first—food and shelter. Some student unions provide ration packs during tough times."
      ],
      followUp: "Have you checked with the university's student welfare division for any available support programs?"
    },
    {
      tag: "suicidal_thoughts",
      patterns: [
        "I want to die", "suicide", "giving up on life",
        "I don't want to exist anymore", "everyone would be better off without me", "ending it all",
        "I have a plan to kill myself", "tired of living", "no reason to live",
        "I want to end my life"
      ],
      responses: [
        "I am so sorry you are in so much pain. Your life is incredibly valuable. Please, immediately call the Sumithrayo helpline at 011 269 2909 or 1333 for toll-free crisis support.",
        "Please hold on. The despair you are feeling right now is speaking, but it does not have to be the end. Call 1333 right now to speak with someone who can help.",
        "I hear how deeply you are hurting and how exhausted you are. You do not have to go through this alone. Reach out to Sumithrayo at 011 269 2909.",
        "It sounds like you are carrying an unbearable amount of pain. Please know there is help available immediately. Dial 1333 (Crisis Support) or go to the nearest emergency room.",
        "Your life matters more than any exam, mistake, or pain you are feeling right now. Please seek professional help right away by calling 1333 or 1926 (National Mental Health Helpline)."
      ],
      followUp: "Please promise me you will reach out to one of those numbers or a trusted loved one right now."
    },
    {
      tag: "positive_progress",
      patterns: [
        "I feel better", "making progress", "I am thankful",
        "passed my exam", "feeling happy today", "I managed to study",
        "things are looking up", "I did well", "I'm proud of myself",
        "thank you for helping me"
      ],
      responses: [
        "That is wonderful news! I'm so glad to hear you're feeling better. Celebrate this moment.",
        "I'm incredibly proud of you! Recognizing your own progress is a huge step in building resilience.",
        "Thank you for sharing that with me. It is great to see the clouds lifting. Keep up the amazing work!",
        "You put in the hard work, and you deserve to feel proud. Remember this feeling of success for the next time things get tough.",
        "That's fantastic! Holding onto these positive moments builds a strong foundation for your mental wellbeing."
      ],
      followUp: "How are you planning to celebrate your progress today?"
    },
    {
      tag: "goodbye",
      patterns: [
        "bye", "goodbye", "see you later",
        "gotta go", "thank you", "thanks for listening",
        "I have to leave", "talk to you later", "ending chat",
        "bye bot"
      ],
      responses: [
        "Goodbye! Remember, I am always here whenever you need to talk. Take care of yourself.",
        "You're very welcome. Take a deep breath and have a gentle rest of your day. See you later!",
        "Bye for now! Don't forget to take breaks and drink some water.",
        "It was nice talking to you. Look after yourself, and feel free to return anytime.",
        "Take care! Remember that your wellbeing comes first. Good luck with everything."
      ],
      followUp: ""
    },
    {
      tag: "unknown",
      patterns: [
        "what", "I don't know", "...", "?",
        "who are you", "can you help me", "random",
        "testing", "blah blah", "not sure"
      ],
      responses: [
        "I'm not completely sure I understood that. Could you try rephrasing or telling me a bit more about how you're feeling?",
        "I'm sorry, I didn't quite catch that. I am here to discuss your mental wellbeing, studies, or any stress you are facing.",
        "That went a bit over my head. Are you experiencing any stress or feeling overwhelmed that you'd like to talk about?",
        "I might not have the answer to that specific question, but I'm always here if you need emotional support or someone to listen.",
        "Could you clarify? As a mental health assistant, I'm here to support you through university challenges and emotional distress."
      ],
      followUp: "Can you tell me more about what's on your mind?"
    },
    {
      tag: "academic_dsa",
      category: "Data Structures & Algorithms",
      patterns: [
        "I am weak on DSA",
        "I don't understand data structures",
        "struggling with algorithms",
        "DSA is hard for me",
        "can't understand linked lists",
        "arrays and strings confuse me",
        "help me with data structures",
        "I fail in DSA",
        "DSA topics are difficult",
        "I need help with algorithms",
        "dsa is killing me bro",
        "can't do trees and graphs man",
        "stacks and queues are making my head spin"
      ],
      responses: [
        "I found some relevant Kuppi sessions that might help you with this topic!",
        "Great that you reached out! Let me find you the right Kuppi session.",
        "Don't worry! With the right guidance you can master this. Check out these sessions!",
        "I found relevant Kuppi sessions from our tutors for this topic.",
        "Learning becomes easier with proper guidance. Here are some Kuppi sessions for you!"
      ],
      followUp: "Would you like me to show you available Kuppi sessions for Data Structures & Algorithms?"
    },
    {
      tag: "academic_math",
      category: "Mathematics",
      patterns: [
        "math is so hard bro",
        "I hate mathematics",
        "failing in discrete math",
        "calculus is killing me man",
        "help with linear algebra",
        "graph theory makes no sense",
        "struggling with logic and probability",
        "I suck at math",
        "math equations are too difficult",
        "need help in mathematics bro"
      ],
      responses: [
        "I found some relevant Kuppi sessions that might help you with this topic!",
        "Great that you reached out! Let me find you the right Kuppi session.",
        "Don't worry! With the right guidance you can master this. Check out these sessions!",
        "I found relevant Kuppi sessions from our tutors for this topic.",
        "Learning becomes easier with proper guidance. Here are some Kuppi sessions for you!"
      ],
      followUp: "Would you like me to show you available Kuppi sessions for Mathematics?"
    },
    {
      tag: "academic_programming",
      category: "Programming Languages",
      patterns: [
        "I can't code bro",
        "struggling to program man",
        "Java is killing me",
        "Python goes over my head",
        "help with C++",
        "JavaScript is too confusing",
        "I suck at programming",
        "failing in coding assignments",
        "learning to code is too hard",
        "I need help with programming languages"
      ],
      responses: [
        "I found some relevant Kuppi sessions that might help you with this topic!",
        "Great that you reached out! Let me find you the right Kuppi session.",
        "Don't worry! With the right guidance you can master this. Check out these sessions!",
        "I found relevant Kuppi sessions from our tutors for this topic.",
        "Learning becomes easier with proper guidance. Here are some Kuppi sessions for you!"
      ],
      followUp: "Would you like me to show you available Kuppi sessions for Programming Languages?"
    },
    {
      tag: "academic_dbms",
      category: "Database Management",
      patterns: [
        "I don't understand databases bro",
        "DBMS is so hard",
        "SQL queries are killing me man",
        "struggling with normalization",
        "how do joins work",
        "relational model is confusing",
        "making tables is difficult",
        "I suck at database management",
        "failing DBMS",
        "need help with SQL"
      ],
      responses: [
        "I found some relevant Kuppi sessions that might help you with this topic!",
        "Great that you reached out! Let me find you the right Kuppi session.",
        "Don't worry! With the right guidance you can master this. Check out these sessions!",
        "I found relevant Kuppi sessions from our tutors for this topic.",
        "Learning becomes easier with proper guidance. Here are some Kuppi sessions for you!"
      ],
      followUp: "Would you like me to show you available Kuppi sessions for Database Management?"
    },
    {
      tag: "academic_networking",
      category: "Computer Networks",
      patterns: [
        "networking is so confusing bro",
        "computer networks is killing me",
        "can't understand OSI model man",
        "TCP/IP makes no sense",
        "IP addressing is too hard",
        "struggling with protocols",
        "help with subnetting",
        "failing in networks",
        "need help in computer networking",
        "networking concepts are difficult"
      ],
      responses: [
        "I found some relevant Kuppi sessions that might help you with this topic!",
        "Great that you reached out! Let me find you the right Kuppi session.",
        "Don't worry! With the right guidance you can master this. Check out these sessions!",
        "I found relevant Kuppi sessions from our tutors for this topic.",
        "Learning becomes easier with proper guidance. Here are some Kuppi sessions for you!"
      ],
      followUp: "Would you like me to show you available Kuppi sessions for Computer Networks?"
    },
    {
      tag: "academic_oop",
      category: "Object-Oriented Programming",
      patterns: [
        "oop is too hard bro",
        "object oriented concepts confuse me",
        "can't understand classes and objects man",
        "inheritance is difficult",
        "struggling with polymorphism",
        "encapsulation and abstraction make no sense",
        "I suck at OOP",
        "failing object oriented programming",
        "need help with OOP concepts",
        "how to do OOP"
      ],
      responses: [
        "I found some relevant Kuppi sessions that might help you with this topic!",
        "Great that you reached out! Let me find you the right Kuppi session.",
        "Don't worry! With the right guidance you can master this. Check out these sessions!",
        "I found relevant Kuppi sessions from our tutors for this topic.",
        "Learning becomes easier with proper guidance. Here are some Kuppi sessions for you!"
      ],
      followUp: "Would you like me to show you available Kuppi sessions for Object-Oriented Programming?"
    },
    {
      tag: "academic_web",
      category: "Web Development",
      patterns: [
        "web dev is killing me bro",
        "HTML and CSS are hard",
        "struggling with React man",
        "Node.js makes no sense",
        "frontend is confusing",
        "backend is difficult",
        "need help with web design",
        "I suck at web development",
        "failing my web dev projects",
        "can't build a website"
      ],
      responses: [
        "I found some relevant Kuppi sessions that might help you with this topic!",
        "Great that you reached out! Let me find you the right Kuppi session.",
        "Don't worry! With the right guidance you can master this. Check out these sessions!",
        "I found relevant Kuppi sessions from our tutors for this topic.",
        "Learning becomes easier with proper guidance. Here are some Kuppi sessions for you!"
      ],
      followUp: "Would you like me to show you available Kuppi sessions for Web Development?"
    },
    {
      tag: "academic_os",
      category: "Operating Systems",
      patterns: [
        "OS is too hard bro",
        "operating systems is killing me",
        "what are processes and threads man",
        "CPU scheduling is confusing",
        "can't understand memory management",
        "deadlock concepts are difficult",
        "I suck at OS",
        "failing operating systems",
        "need help with OS",
        "struggling with OS topics"
      ],
      responses: [
        "I found some relevant Kuppi sessions that might help you with this topic!",
        "Great that you reached out! Let me find you the right Kuppi session.",
        "Don't worry! With the right guidance you can master this. Check out these sessions!",
        "I found relevant Kuppi sessions from our tutors for this topic.",
        "Learning becomes easier with proper guidance. Here are some Kuppi sessions for you!"
      ],
      followUp: "Would you like me to show you available Kuppi sessions for Operating Systems?"
    },
    {
      tag: "academic_se",
      category: "Software Engineering",
      patterns: [
        "software engineering is boring bro",
        "can't understand SDLC man",
        "agile and scrum are confusing",
        "struggling with design patterns",
        "SOLID principles make no sense",
        "system testing is too hard",
        "I suck at SE",
        "failing software engineering",
        "need help with SE subjects",
        "SE concepts are killing me"
      ],
      responses: [
        "I found some relevant Kuppi sessions that might help you with this topic!",
        "Great that you reached out! Let me find you the right Kuppi session.",
        "Don't worry! With the right guidance you can master this. Check out these sessions!",
        "I found relevant Kuppi sessions from our tutors for this topic.",
        "Learning becomes easier with proper guidance. Here are some Kuppi sessions for you!"
      ],
      followUp: "Would you like me to show you available Kuppi sessions for Software Engineering?"
    },
    {
      tag: "academic_cybersecurity",
      category: "Cybersecurity",
      patterns: [
        "cybersecurity is too difficult bro",
        "can't understand security concepts",
        "hacking topics are confusing man",
        "struggling with encryption",
        "what is SQL injection",
        "authentication and firewall are hard",
        "failing in cybersecurity",
        "need help with security",
        "I suck at cybersec",
        "cyber is killing me"
      ],
      responses: [
        "I found some relevant Kuppi sessions that might help you with this topic!",
        "Great that you reached out! Let me find you the right Kuppi session.",
        "Don't worry! With the right guidance you can master this. Check out these sessions!",
        "I found relevant Kuppi sessions from our tutors for this topic.",
        "Learning becomes easier with proper guidance. Here are some Kuppi sessions for you!"
      ],
      followUp: "Would you like me to show you available Kuppi sessions for Cybersecurity?"
    },
    {
      tag: "academic_ai",
      category: "AI & Machine Learning",
      patterns: [
        "AI is so hard bro",
        "machine learning is killing me man",
        "can't understand neural networks",
        "deep learning makes no sense",
        "struggling with regression and classification",
        "data science is too difficult",
        "failing AI class",
        "need help with ML",
        "I suck at machine learning",
        "AI algorithms confuse me"
      ],
      responses: [
        "I found some relevant Kuppi sessions that might help you with this topic!",
        "Great that you reached out! Let me find you the right Kuppi session.",
        "Don't worry! With the right guidance you can master this. Check out these sessions!",
        "I found relevant Kuppi sessions from our tutors for this topic.",
        "Learning becomes easier with proper guidance. Here are some Kuppi sessions for you!"
      ],
      followUp: "Would you like me to show you available Kuppi sessions for AI & Machine Learning?"
    },
    {
      tag: "academic_general",
      category: null,
      patterns: [
        "I need academic help bro",
        "struggling with my studies man",
        "can't understand my subjects",
        "help me study",
        "weak in my subjects",
        "I need a tutor",
        "can you recommend a session",
        "I'm failing my degree",
        "need someone to teach me",
        "I need help with passing"
      ],
      responses: [
        "Which particular subject or topic are you struggling with? I can recommend a Kuppi session for you.",
        "Sorry to hear you are having a hard time. Tell me what subject you need help with, and I'll find a Kuppi session.",
        "I can help with that! Which subject do you want me to look up Kuppi sessions for?",
        "Don't worry, many students feel this way. What subject is bothering you the most right now? I'll find some sessions.",
        "Kuppi sessions are a great way to improve! What subject should I search Kuppi sessions for?"
      ],
      followUp: "Which subject or topic do you need a Kuppi session for?"
    },
    {
      tag: "academic_devops",
      category: "DevOps & Cloud",
      patterns: [
        "I am weak on Linux",
        "I don't understand Docker",
        "help me with cloud computing",
        "struggling with DevOps bro",
        "AWS is confusing me",
        "I can't understand Kubernetes",
        "Linux commands are hard",
        "I need help with cloud platforms",
        "DevOps is difficult man",
        "I don't know how to use Git"
      ],
      responses: [
        "I found some relevant Kuppi sessions that might help you with this topic!",
        "Great that you reached out! Let me find you the right Kuppi session.",
        "Don't worry! With the right guidance you can master this. Check out these sessions!",
        "I found relevant Kuppi sessions from our tutors for this topic.",
        "Learning becomes easier with proper guidance. Here are some Kuppi sessions for you!"
      ],
      followUp: "Would you like me to show you available Kuppi sessions for DevOps & Cloud?"
    }
  ]
};

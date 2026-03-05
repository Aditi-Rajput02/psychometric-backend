const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Test = require('./models/Test');

dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/career_app';

mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB for seeding');

    await Test.deleteMany({});

    const tests = [
      {
        title: 'Multiple Intelligence Test',
        description: 'Discover your unique intelligence types across linguistic, logical, spatial, musical, bodily, interpersonal, intrapersonal, and naturalistic domains.',
        questions: [
          { text: 'I enjoy solving math problems and puzzles', options: [{ text: 'Strongly Disagree', value: 1 }, { text: 'Disagree', value: 2 }, { text: 'Agree', value: 3 }, { text: 'Strongly Agree', value: 4 }] },
          { text: 'I find it easy to understand spatial relationships and visualize objects', options: [{ text: 'Strongly Disagree', value: 1 }, { text: 'Disagree', value: 2 }, { text: 'Agree', value: 3 }, { text: 'Strongly Agree', value: 4 }] },
          { text: 'I have a strong sense of rhythm and enjoy music', options: [{ text: 'Strongly Disagree', value: 1 }, { text: 'Disagree', value: 2 }, { text: 'Agree', value: 3 }, { text: 'Strongly Agree', value: 4 }] },
          { text: 'I prefer working with people and enjoy social interactions', options: [{ text: 'Strongly Disagree', value: 1 }, { text: 'Disagree', value: 2 }, { text: 'Agree', value: 3 }, { text: 'Strongly Agree', value: 4 }] },
          { text: 'I am athletic and enjoy physical activities', options: [{ text: 'Strongly Disagree', value: 1 }, { text: 'Disagree', value: 2 }, { text: 'Agree', value: 3 }, { text: 'Strongly Agree', value: 4 }] }
        ]
      },
      {
        title: 'Learning Style Assessment',
        description: 'Identify your preferred learning style: Visual, Auditory, Reading/Writing, or Kinesthetic.',
        questions: [
          { text: 'I learn best by seeing diagrams, pictures, and visual aids', options: [{ text: 'Strongly Disagree', value: 1 }, { text: 'Disagree', value: 2 }, { text: 'Agree', value: 3 }, { text: 'Strongly Agree', value: 4 }] },
          { text: 'I prefer listening to lectures and discussions', options: [{ text: 'Strongly Disagree', value: 1 }, { text: 'Disagree', value: 2 }, { text: 'Agree', value: 3 }, { text: 'Strongly Agree', value: 4 }] },
          { text: 'I enjoy reading and writing to understand concepts', options: [{ text: 'Strongly Disagree', value: 1 }, { text: 'Disagree', value: 2 }, { text: 'Agree', value: 3 }, { text: 'Strongly Agree', value: 4 }] },
          { text: 'I learn best by doing hands-on activities and experiments', options: [{ text: 'Strongly Disagree', value: 1 }, { text: 'Disagree', value: 2 }, { text: 'Agree', value: 3 }, { text: 'Strongly Agree', value: 4 }] },
          { text: 'I need to move around and take breaks while studying', options: [{ text: 'Strongly Disagree', value: 1 }, { text: 'Disagree', value: 2 }, { text: 'Agree', value: 3 }, { text: 'Strongly Agree', value: 4 }] }
        ]
      },
      {
        title: 'Career Guidance Assessment',
        description: 'Explore suitable career paths based on your interests, skills, and personality traits.',
        questions: [
          { text: 'I enjoy working with people and helping them', options: [{ text: 'Not at all', value: 1 }, { text: 'Somewhat', value: 2 }, { text: 'Very Much', value: 3 }, { text: 'Extremely', value: 4 }] },
          { text: 'I prefer creative and artistic work', options: [{ text: 'Not at all', value: 1 }, { text: 'Somewhat', value: 2 }, { text: 'Very Much', value: 3 }, { text: 'Extremely', value: 4 }] },
          { text: 'I am detail-oriented and organized', options: [{ text: 'Not at all', value: 1 }, { text: 'Somewhat', value: 2 }, { text: 'Very Much', value: 3 }, { text: 'Extremely', value: 4 }] },
          { text: 'I like leading and managing others', options: [{ text: 'Not at all', value: 1 }, { text: 'Somewhat', value: 2 }, { text: 'Very Much', value: 3 }, { text: 'Extremely', value: 4 }] },
          { text: 'I enjoy problem-solving and innovation', options: [{ text: 'Not at all', value: 1 }, { text: 'Somewhat', value: 2 }, { text: 'Very Much', value: 3 }, { text: 'Extremely', value: 4 }] }
        ]
      },
      {
        title: 'Fear Of Relationship Commitment Test',
        description: 'Assess your comfort level with commitment in relationships.',
        questions: [
          { text: 'I feel anxious when thinking about long-term commitment', options: [{ text: 'Never', value: 1 }, { text: 'Sometimes', value: 2 }, { text: 'Often', value: 3 }, { text: 'Always', value: 4 }] },
          { text: 'I worry about losing my independence in a relationship', options: [{ text: 'Never', value: 1 }, { text: 'Sometimes', value: 2 }, { text: 'Often', value: 3 }, { text: 'Always', value: 4 }] },
          { text: 'I fear being hurt or abandoned by a partner', options: [{ text: 'Never', value: 1 }, { text: 'Sometimes', value: 2 }, { text: 'Often', value: 3 }, { text: 'Always', value: 4 }] },
          { text: 'I believe committing to one person is limiting', options: [{ text: 'Never', value: 1 }, { text: 'Sometimes', value: 2 }, { text: 'Often', value: 3 }, { text: 'Always', value: 4 }] },
          { text: 'I feel pressured when partners want to move the relationship forward', options: [{ text: 'Never', value: 1 }, { text: 'Sometimes', value: 2 }, { text: 'Often', value: 3 }, { text: 'Always', value: 4 }] }
        ]
      },
      {
        title: 'Relationship Attachment Style Test',
        description: 'Discover your attachment style: Secure, Anxious, Avoidant, or Fearful.',
        questions: [
          { text: 'I feel comfortable depending on others', options: [{ text: 'Strongly Disagree', value: 1 }, { text: 'Disagree', value: 2 }, { text: 'Agree', value: 3 }, { text: 'Strongly Agree', value: 4 }] },
          { text: 'I worry about being abandoned by loved ones', options: [{ text: 'Strongly Disagree', value: 1 }, { text: 'Disagree', value: 2 }, { text: 'Agree', value: 3 }, { text: 'Strongly Agree', value: 4 }] },
          { text: 'I prefer not to show my feelings to others', options: [{ text: 'Strongly Disagree', value: 1 }, { text: 'Disagree', value: 2 }, { text: 'Agree', value: 3 }, { text: 'Strongly Agree', value: 4 }] },
          { text: 'I seek reassurance from my partner frequently', options: [{ text: 'Strongly Disagree', value: 1 }, { text: 'Disagree', value: 2 }, { text: 'Agree', value: 3 }, { text: 'Strongly Agree', value: 4 }] },
          { text: 'I feel secure and stable in my relationships', options: [{ text: 'Strongly Disagree', value: 1 }, { text: 'Disagree', value: 2 }, { text: 'Agree', value: 3 }, { text: 'Strongly Agree', value: 4 }] }
        ]
      },
      {
        title: 'Gender Roles Test (For Women)',
        description: 'Explore your beliefs about traditional and modern gender roles for women.',
        questions: [
          { text: 'I believe women should prioritize career development', options: [{ text: 'Strongly Disagree', value: 1 }, { text: 'Disagree', value: 2 }, { text: 'Agree', value: 3 }, { text: 'Strongly Agree', value: 4 }] },
          { text: 'I feel pressured by traditional expectations of femininity', options: [{ text: 'Strongly Disagree', value: 1 }, { text: 'Disagree', value: 2 }, { text: 'Agree', value: 3 }, { text: 'Strongly Agree', value: 4 }] },
          { text: 'I believe domestic responsibilities should be shared equally', options: [{ text: 'Strongly Disagree', value: 1 }, { text: 'Disagree', value: 2 }, { text: 'Agree', value: 3 }, { text: 'Strongly Agree', value: 4 }] },
          { text: 'I feel empowered to make my own life choices', options: [{ text: 'Strongly Disagree', value: 1 }, { text: 'Disagree', value: 2 }, { text: 'Agree', value: 3 }, { text: 'Strongly Agree', value: 4 }] },
          { text: 'I value independence equally as much as family', options: [{ text: 'Strongly Disagree', value: 1 }, { text: 'Disagree', value: 2 }, { text: 'Agree', value: 3 }, { text: 'Strongly Agree', value: 4 }] }
        ]
      },
      {
        title: 'Gender Roles Test (For Men)',
        description: 'Explore your beliefs about traditional and modern gender roles for men.',
        questions: [
          { text: 'I feel pressured to be the primary breadwinner', options: [{ text: 'Strongly Disagree', value: 1 }, { text: 'Disagree', value: 2 }, { text: 'Agree', value: 3 }, { text: 'Strongly Agree', value: 4 }] },
          { text: 'I believe men should be emotionally expressive', options: [{ text: 'Strongly Disagree', value: 1 }, { text: 'Disagree', value: 2 }, { text: 'Agree', value: 3 }, { text: 'Strongly Agree', value: 4 }] },
          { text: 'I want to be equally involved in childcare and household duties', options: [{ text: 'Strongly Disagree', value: 1 }, { text: 'Disagree', value: 2 }, { text: 'Agree', value: 3 }, { text: 'Strongly Agree', value: 4 }] },
          { text: 'I feel free to pursue caregiving or nurturing roles', options: [{ text: 'Strongly Disagree', value: 1 }, { text: 'Disagree', value: 2 }, { text: 'Agree', value: 3 }, { text: 'Strongly Agree', value: 4 }] },
          { text: 'I believe strength means being vulnerable when needed', options: [{ text: 'Strongly Disagree', value: 1 }, { text: 'Disagree', value: 2 }, { text: 'Agree', value: 3 }, { text: 'Strongly Agree', value: 4 }] }
        ]
      }
    ];

    await Test.insertMany(tests);
    console.log('7 assessments created successfully');
    mongoose.connection.close();
  })
  .catch((err) => console.error(err));

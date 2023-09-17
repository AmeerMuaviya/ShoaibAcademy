let TeacherQuotes=[
    "Education is not the filling of a pail, but the lighting of a fire. -- William Butler Yeats",
    "The art of teaching is the art of assisting discovery. -- Mark Van Doren",
    "Teachers can change lives with just the right mix of chalk and challenges. -- Joyce Meyer",
    "The best teachers are those who show you where to look, but don't tell you what to see. -- Alexandra K. Trenfor",
    "The mediocre teacher tells. The good teacher explains. The superior teacher demonstrates. The great teacher inspires. -- William Arthur Ward",
    "The best teachers are those who pass on their zeal and enthusiasm as a legacy to their students. -- Robert John Meehan",
    "Good teaching is one-fourth preparation and three-fourths theater. -- Gail Godwin",
    "The teacher who is indeed wise does not bid you to enter the house of his wisdom but rather leads you to the threshold of your mind. -- Kahlil Gibran",
    "In learning you will teach, and in teaching you will learn. -- Phil Collins",
    "The greatest sign of success for a teacher... is to be able to say, 'The children are now working as if I did not exist.' -- Maria Montessori",
    "Teachers can change lives with just the right mix of chalk and challenges. -- Joyce Meyer",
    "A good teacher can inspire hope, ignite the imagination, and instill a love of learning. -- Brad Henry",
    "Teachers affect eternity; no one can tell where their influence stops. -- Henry Brooks Adams",
    "The object of teaching a child is to enable him to get along without his teacher. -- Elbert Hubbard",
    "A good teacher is like a candle – it consumes itself to light the way for others. -- Mustafa Kemal Atatürk",
    "The task of the modern educator is not to cut down jungles, but to irrigate deserts. -- C.S. Lewis",
    "Teaching is the greatest act of optimism. -- Colleen Wilcox",
    "Teaching is not a lost art, but the regard for it is a lost tradition. -- Jacques Barzun",
    "Teaching is a very noble profession that shapes the character, caliber, and future of an individual. If the people remember me as a good teacher, that will be the biggest honor for me. -- A. P. J. Abdul Kalam",
    "The role of a teacher is to inspire, to challenge, to guide, and to facilitate learning. -- Kelly Ann McKee",
    "The best teachers are those who show you where to look, but don't tell you what to see. -- Alexandra K. Trenfor",
    "Teaching is not about answering questions but about raising questions – opening doors for them in places that they could not imagine. -- Yawar Baig",
    "A teacher who loves learning earns the right and the ability to help others learn. -- Ruth Beechick",
    "A good teacher is like a good entertainer – first, he must hold his audience's attention, then he can teach his lesson. -- John Henrik Clarke",
    "Teaching is a calling too. And I've always thought that teachers in their way are holy – angels leading their flocks out of the darkness. -- Jeannette Walls",
    "Teaching is not a profession; it's a passion. -- Unknown",
    "Teaching is the one profession that creates all other professions. -- Unknown"]

let StudentQuotes=[
    "Believe you can and you're halfway there. -- Theodore Roosevelt",
    "Education is the passport to the future, for tomorrow belongs to those who prepare for it today. -- Malcolm X",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. -- Winston Churchill",
    "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. -- Steve Jobs",
    "The future belongs to those who believe in the beauty of their dreams. -- Eleanor Roosevelt",
    "You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose. -- Dr. Seuss",
    "It does not matter how slowly you go as long as you do not stop. -- Confucius",
    "The only limit to our realization of tomorrow will be our doubts of today. -- Franklin D. Roosevelt",
    "Don't let yesterday take up too much of today. -- Will Rogers",
    "If you want to live a happy life, tie it to a goal, not to people or things. -- Albert Einstein",
    "A person who never made a mistake never tried anything new. -- Albert Einstein",
    "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful. -- Albert Schweitzer",
    "You miss 100% of the shots you don't take. -- Wayne Gretzky",
    "You are never too old to set another goal or to dream a new dream. -- C.S. Lewis",
    "Be the change you wish to see in the world. -- Mahatma Gandhi",
    "Strive not to be a success, but rather to be of value. -- Albert Einstein",
    "Don't watch the clock; do what it does. Keep going. -- Sam Levenson",
    "You don't have to be great to start, but you have to start to be great. -- Zig Ziglar",
    "The secret of getting ahead is getting started. -- Mark Twain",
    "In three words I can sum up everything I've learned about life: it goes on. -- Robert Frost",
    "What you get by achieving your goals is not as important as what you become by achieving your goals. -- Zig Ziglar",
    "Be the best version of yourself. -- Unknown",
    "You are the designer of your destiny; you are the author of your story. -- Lisa Nichols",
    "The greatest glory in living lies not in never falling, but in rising every time we fall. -- Nelson Mandela",
    "The two most important days in your life are the day you are born and the day you find out why. -- Mark Twain",
    "Don't be afraid to give up the good to go for the great. -- John D. Rockefeller",
    "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle. -- Christian D. Larson",
    "Happiness is not something ready made. It comes from your own actions. -- Dalai Lama",
    "I have not failed. I've just found 10,000 ways that won't work. -- Thomas Edison",
    "Your time is limited, don't waste it living someone else's life. -- Steve Jobs",
    "The purpose of life is to live it, to taste experience to the utmost, to reach out eagerly and without fear for newer and richer experience. -- Eleanor Roosevelt",]
    function getRandomQuote(quotesArray) {
        const randomIndex = Math.floor(Math.random() * quotesArray.length);
        const quoteString = quotesArray[randomIndex];
        const [quote, author] = quoteString.split(' -- ');
      
        return { quote, author };
      }
      let obj={
        Teacher:getRandomQuote(TeacherQuotes),
        Student:getRandomQuote(StudentQuotes)
      }
export default obj;
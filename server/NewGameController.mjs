import MemeDao from "./dao/memeDAO.mjs";
import BestDao from "./dao/bestDAO.mjs";
import AnswerDao from "./dao/answerDAO.mjs";

//initiate the DAOs
const memeDao = new MemeDao();
const bestDao = new BestDao();
const answerDao = new AnswerDao();

function Round(meme, answers) {
    this.meme = meme;
    this.answers = answers;
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

export default function NewGameController() {
    //Game for logged users, three rounds
    this.newLogGame = async () => {
        const memeNumber = await memeDao.getMemeNumber();
        const answerNumber = await answerDao.getAnswerNumber();
        let rounds = [];
        let memes = [];
        do {
            let meme_id = Math.floor(Math.random() * memeNumber)+1;
            if (!memes.includes(meme_id)) {
                memes.push(meme_id);
            }
        }while (memes.length < 3);
        for (let i = 0; i < 3; i++) {
            let bests = await bestDao.getBest(memes[i]);
            let allBest = await bestDao.getAllBest(memes[i]);
            let answers = [];
            do {
                let answer_id = Math.floor(Math.random() * answerNumber)+1;
                if (!answers.includes(answer_id) && !(allBest.includes(answer_id))){
                    answers.push(answer_id);
                }
            } while (answers.length < 5);
            const meme = await memeDao.getMeme(memes[i]);
            const ans = await answerDao.getAnswer(answers);
            const bestFit = await answerDao.getBests(bests);
            bestFit.map((bf) => ans.push(bf));
            shuffle(ans);
            rounds.push(new Round(meme, ans));
        }
        return rounds;

    }

    //Game for not logged users, only one round
    this.newGuestGame = async () => {
        const memeNumber = await memeDao.getMemeNumber();
        const answerNumber = await answerDao.getAnswerNumber();
        let meme_id = Math.floor(Math.random() * memeNumber)+1;
        let bests = await bestDao.getBest(meme_id);
        let allBest = await bestDao.getAllBest(meme_id);
        let answers = [];
        do {
            let answer_id = Math.floor(Math.random() * answerNumber)+1;
            if (!answers.includes(answer_id) && !(allBest.includes(answer_id))){
                answers.push(answer_id);
            }
        } while (answers.length < 5);
        const meme = await memeDao.getMeme(meme_id);
        const ans = await answerDao.getAnswer(answers);
        const bestFit = await answerDao.getBests(bests);
        bestFit.map((bf) => ans.push(bf));
        shuffle(ans);
        const round =  new Round(meme, ans);
        return round;
    }
};
import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    // TODO
    const categoryRepository = getRepository(Category);
    const transactionRepository = getCustomRepository(TransactionRepository);

    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('Insuficient Founds!');
    }

    const categoryDB = await categoryRepository.findOne({
      where: { title: category },
    });

    let id = '';
    if (!categoryDB) {
      const newCategory = categoryRepository.create({ title: category });
      await categoryRepository.save(newCategory);
      id = newCategory.id;
    } else {
      id = categoryDB.id;
    }

    // let transactionCategory = await categoryRepository.findOne({
    //   where: { title: category },
    // });

    // if (!transactionCategory) {
    //   transactionCategory = categoryRepository.create({ title: category });
    //   await categoryRepository.save(transactionCategory);
    // }

    const transaction = transactionRepository.create({
      category_id: id,
      title,
      type,
      value,
      // category: transactionCategory,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;

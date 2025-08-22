import pool from '../config/db';

export async function issueChips(
  userId: string,
  amount: number,
  operatorId: string
) {
  return pool.connect().then(async client => {
    try {
      await client.query('BEGIN');

      // 残高を増加
      await client.query(
        `INSERT INTO chip_transactions (to_account_id, amount, type, operator_id)
         VALUES ($1, $2, 'ISSUE', $3)`,
        [userId, amount, operatorId]
      );
      await client.query(
        `UPDATE chip_accounts
         SET balance = balance + $1
         WHERE user_id = $2`,
        [amount, userId]
      );

      const { rows } = await client.query(
        `SELECT * FROM chip_transactions
         WHERE to_account_id = $1
         ORDER BY created_at DESC
         LIMIT 1`,
        [userId]
      );

      await client.query('COMMIT');
      return rows[0];
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  });
}
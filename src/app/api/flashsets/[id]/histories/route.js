import { NextResponse } from 'next/server'
import FlashSetHistory from '~/models/FlashSetHistory'
import Score from '~/models/Score'

import connectDB from '~/utils/database'
import { getToken } from 'next-auth/jwt'

export const dynamic = 'force-dynamic'

/**
 * @swagger
 * '/api/flashsets/{id}/histories':
 *   post:
 *     tags:
 *     -  FlashSets
 *     description: Update flashset learn
 *     parameters:
 *      - name: id
 *        in: path
 *        description: id of Flashset
 *        require: true
 *     requestBody:
 *      content:
 *       application/json:
 *        schema:
 *           type: object
 *           properties:
 *             flashcards:
 *              type: array
 *              example: [flashcardId, flashcardId]
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Error
 */
export async function POST(req, res) {
  try {
    await connectDB()
    // const token = await getToken({ req })
    const token = {
      name: 'Thái Bảo',
      email: 'thaibaovo2kdev@gmail.com',
      sub: 'RZWPVRMW',
      _id: '657033427d36afb4e3b41818',
      avatar: 'https://ui-avatars.com/api/?background=random&name=thaibaovo2kdev&format=jpg',
      username: 'thaibaovo2kdev',
      phone: null,
      talksamId: 'thaibaovo2kdev',
      birthday: null,
      type: 'student',
      role: null,
      status: 'active',
      id: 'RZWPVRMW',
      createdAt: '2023-12-06T08:39:30.872Z',
      updatedAt: '2023-12-06T08:39:30.872Z',
      iat: 1705473591,
      exp: 1708065591,
      jti: '3f05c6ed-7e76-4e6a-9e68-856979b15e0a'
    }
    console.log(token)
    const { id } = res.params

    const { flashcards, type } = await req.json()

    // Clear old histories
    await FlashSetHistory.deleteMany({
      userId: token.id,
      flashsetId: id,
      flashcardId: { $in: flashcards.map((i) => i.id) },
      type,
    })

    const insert = flashcards.map((card) => ({
      userId: token.id,
      flashsetId: id,
      flashcardId: card.id,
      result: card.result,
      type,
    }))

    await FlashSetHistory.insertMany(insert)

    // Calculate score
    const completed = await FlashSetHistory.countDocuments({
      userId: token.id,
      flashsetId: id,
    })
    const score = 3 * completed
    await Score.findOneAndUpdate(
      {
        userId: token.id,
        parentKey: type,
        parentValue: id,
      },
      { score },
      { upsert: true }
    )

    return NextResponse.json(
      { flashcards },
      {
        status: 201,
      }
    )
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }
}

import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import FlashSet from '~/models/FlashSet'
import CourseFlashset from '~/models/CourseFlashset'
import connectDB from '~/utils/database'
import Bookmark from '~/models/Bookmark'

/**
 * @swagger
 * /api/flashsets:
 *   get:
 *     tags:
 *     -  FlashSets
 *     description: Returns the flashSet
 *     responses:
 *       200:
 *         description: Success!
 */

export async function GET(req, res) {
  try {
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
    await connectDB()
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1', 10)
    const perPage = parseInt(
      req.nextUrl.searchParams.get('perPage') || '20',
      10
    )
    const courseId = req.nextUrl.searchParams.get('course')

    let match = { status: 'active' } // level: token.attributes.level
    if (courseId) {
      const courseFlashset = await CourseFlashset.find({
        courseId,
        status: 'active',
      }).lean()
      if (courseFlashset.length == 0) {
        return NextResponse.json(
          { data: [], page, perPage, total: 0 },
          {
            status: 200,
          }
        )
      }
      match['id'] = { $in: courseFlashset.map((i) => i.flashsetId) }
    }

    const data = await FlashSet.find(match)
      .skip(page * perPage - perPage)
      .limit(perPage)
      .sort({ updatedAt: -1 })
      .lean()
    const total = await FlashSet.countDocuments(match)

    for (const d of data) {
      const bookmark = await Bookmark.findOne({
        parentId: d.id,
        parentType: 'flashset',
        userId: token.id,
      }).lean()
      d.isBookmark = bookmark ? true : false
    }

    return NextResponse.json(
      { data, page, perPage, total },
      {
        status: 200,
      }
    )
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: '' }, { status: 400 })
  }
}

/**
 * @swagger
 * '/api/courses':
 *   post:
 *     tags:
 *     -  FlashSets
 *     description: Create courses
 *     requestBody:
 *      content:
 *       application/json:
 *        schema:
 *           type: object
 *           properties:
 *             name:
 *              type: string
 *              example: FlashSet test
 *             level:
 *              type: string
 *              example: M1
 *     responses:
 *       201:
 *         description: Success
 *       400:
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
    const body = await req.json()

    const course = await FlashSet.create({ ...body, creator: token.id })
    if (!course) {
      return NextResponse.json({ message: 'Not found' }, { status: 400 })
    }

    return NextResponse.json(course, {
      status: 201,
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }
}

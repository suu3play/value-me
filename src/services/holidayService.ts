import HolidayJP from '@holiday-jp/holiday_jp';

export interface Holiday {
  date: Date;
  name: string;
  nameEn: string;
}

export interface HolidayCount {
  totalHolidays: number;
  weekendDays: number;
  publicHolidays: number;
  compensationHolidays: number;
}

class HolidayService {
  private cache: Map<string, Holiday[]> = new Map();
  private fallbackHolidays: Map<string, Holiday[]> = new Map();

  constructor() {
    this.initializeFallbackData();
  }

  private initializeFallbackData(): void {
    const fallback2024: Holiday[] = [
      { date: new Date(2024, 0, 1), name: '元日', nameEn: 'New Year\'s Day' },
      { date: new Date(2024, 0, 8), name: '成人の日', nameEn: 'Coming of Age Day' },
      { date: new Date(2024, 1, 11), name: '建国記念の日', nameEn: 'National Foundation Day' },
      { date: new Date(2024, 1, 12), name: '建国記念の日 振替休日', nameEn: 'National Foundation Day (Observed)' },
      { date: new Date(2024, 1, 23), name: '天皇誕生日', nameEn: 'Emperor\'s Birthday' },
      { date: new Date(2024, 2, 20), name: '春分の日', nameEn: 'Vernal Equinox Day' },
      { date: new Date(2024, 3, 29), name: '昭和の日', nameEn: 'Showa Day' },
      { date: new Date(2024, 4, 3), name: '憲法記念日', nameEn: 'Constitution Memorial Day' },
      { date: new Date(2024, 4, 4), name: 'みどりの日', nameEn: 'Greenery Day' },
      { date: new Date(2024, 4, 5), name: 'こどもの日', nameEn: 'Children\'s Day' },
      { date: new Date(2024, 4, 6), name: 'こどもの日 振替休日', nameEn: 'Children\'s Day (Observed)' },
      { date: new Date(2024, 6, 15), name: '海の日', nameEn: 'Marine Day' },
      { date: new Date(2024, 7, 11), name: '山の日', nameEn: 'Mountain Day' },
      { date: new Date(2024, 7, 12), name: '山の日 振替休日', nameEn: 'Mountain Day (Observed)' },
      { date: new Date(2024, 8, 16), name: '敬老の日', nameEn: 'Respect for the Aged Day' },
      { date: new Date(2024, 8, 22), name: '秋分の日', nameEn: 'Autumnal Equinox Day' },
      { date: new Date(2024, 8, 23), name: '秋分の日 振替休日', nameEn: 'Autumnal Equinox Day (Observed)' },
      { date: new Date(2024, 9, 14), name: 'スポーツの日', nameEn: 'Sports Day' },
      { date: new Date(2024, 10, 3), name: '文化の日', nameEn: 'Culture Day' },
      { date: new Date(2024, 10, 4), name: '文化の日 振替休日', nameEn: 'Culture Day (Observed)' },
      { date: new Date(2024, 10, 23), name: '勤労感謝の日', nameEn: 'Labour Thanksgiving Day' },
    ];

    const fallback2025: Holiday[] = [
      { date: new Date(2025, 0, 1), name: '元日', nameEn: 'New Year\'s Day' },
      { date: new Date(2025, 0, 13), name: '成人の日', nameEn: 'Coming of Age Day' },
      { date: new Date(2025, 1, 11), name: '建国記念の日', nameEn: 'National Foundation Day' },
      { date: new Date(2025, 1, 23), name: '天皇誕生日', nameEn: 'Emperor\'s Birthday' },
      { date: new Date(2025, 1, 24), name: '天皇誕生日 振替休日', nameEn: 'Emperor\'s Birthday (Observed)' },
      { date: new Date(2025, 2, 20), name: '春分の日', nameEn: 'Vernal Equinox Day' },
      { date: new Date(2025, 3, 29), name: '昭和の日', nameEn: 'Showa Day' },
      { date: new Date(2025, 4, 3), name: '憲法記念日', nameEn: 'Constitution Memorial Day' },
      { date: new Date(2025, 4, 4), name: 'みどりの日', nameEn: 'Greenery Day' },
      { date: new Date(2025, 4, 5), name: 'こどもの日', nameEn: 'Children\'s Day' },
      { date: new Date(2025, 4, 6), name: 'こどもの日 振替休日', nameEn: 'Children\'s Day (Observed)' },
      { date: new Date(2025, 6, 21), name: '海の日', nameEn: 'Marine Day' },
      { date: new Date(2025, 7, 11), name: '山の日', nameEn: 'Mountain Day' },
      { date: new Date(2025, 8, 15), name: '敬老の日', nameEn: 'Respect for the Aged Day' },
      { date: new Date(2025, 8, 23), name: '秋分の日', nameEn: 'Autumnal Equinox Day' },
      { date: new Date(2025, 9, 13), name: 'スポーツの日', nameEn: 'Sports Day' },
      { date: new Date(2025, 10, 3), name: '文化の日', nameEn: 'Culture Day' },
      { date: new Date(2025, 10, 23), name: '勤労感謝の日', nameEn: 'Labour Thanksgiving Day' },
      { date: new Date(2025, 10, 24), name: '勤労感謝の日 振替休日', nameEn: 'Labour Thanksgiving Day (Observed)' },
    ];

    this.fallbackHolidays.set('2024', fallback2024);
    this.fallbackHolidays.set('2025', fallback2025);
  }

  async getHolidays(year: number, isFiscal: boolean = false): Promise<Holiday[]> {
    const cacheKey = `${year}-${isFiscal ? 'fiscal' : 'calendar'}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const holidays = isFiscal ? 
        this.getFiscalYearHolidays(year) : 
        this.getHolidaysFromLibrary(year);
      this.cache.set(cacheKey, holidays);
      return holidays;
    } catch (error) {
      console.warn(`Failed to get holidays for ${year}, using fallback data:`, error);
      return this.getFallbackHolidays(year, isFiscal);
    }
  }

  private getFiscalYearHolidays(fiscalYear: number): Holiday[] {
    // 年度：4月1日 - 翌年3月31日
    const currentYearHolidays = this.getHolidaysFromLibrary(fiscalYear);
    const nextYearHolidays = this.getHolidaysFromLibrary(fiscalYear + 1);
    
    const fiscalHolidays: Holiday[] = [];
    
    // 当年4月-12月の祝日
    currentYearHolidays.forEach(holiday => {
      if (holiday.date.getMonth() >= 3) { // 4月以降
        fiscalHolidays.push(holiday);
      }
    });
    
    // 翌年1月-3月の祝日
    nextYearHolidays.forEach(holiday => {
      if (holiday.date.getMonth() < 3) { // 3月以前
        fiscalHolidays.push(holiday);
      }
    });
    
    return fiscalHolidays.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  private getHolidaysFromLibrary(year: number): Holiday[] {
    const holidays: Holiday[] = [];
    
    try {
      // 異なる方法でライブラリを使用
      const yearHolidays = HolidayJP.between(new Date(year, 0, 1), new Date(year, 11, 31));
      
      if (yearHolidays && yearHolidays.length > 0) {
        yearHolidays.forEach((holiday: any) => {
          holidays.push({
            date: new Date(holiday.date),
            name: holiday.name || '祝日',
            nameEn: holiday.name_en || 'Holiday'
          });
        });
      } else {
        // フォールバック：日付チェック方法
        for (let month = 1; month <= 12; month++) {
          const daysInMonth = new Date(year, month, 0).getDate();
          for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month - 1, day);
            const holiday = HolidayJP.isHoliday(date);
            
            if (holiday) {
              const holidayData = {
                date: new Date(date),
                name: typeof holiday === 'object' && (holiday as any).name ? (holiday as any).name : '祝日',
                nameEn: typeof holiday === 'object' && (holiday as any).name_en ? (holiday as any).name_en : 'Holiday'
              };
              holidays.push(holidayData);
            }
          }
        }
      }
    } catch (error) {
      console.warn('Error getting holidays from library, using fallback');
    }
    
    return holidays;
  }

  private getFallbackHolidays(year: number, isFiscal: boolean = false): Holiday[] {
    if (isFiscal) {
      const currentYear = this.fallbackHolidays.get(year.toString()) || [];
      const nextYear = this.fallbackHolidays.get((year + 1).toString()) || [];
      
      const fiscalHolidays: Holiday[] = [];
      currentYear.forEach(holiday => {
        if (holiday.date.getMonth() >= 3) {
          fiscalHolidays.push(holiday);
        }
      });
      nextYear.forEach(holiday => {
        if (holiday.date.getMonth() < 3) {
          fiscalHolidays.push(holiday);
        }
      });
      
      return fiscalHolidays.sort((a, b) => a.date.getTime() - b.date.getTime());
    } else {
      const yearStr = year.toString();
      return this.fallbackHolidays.get(yearStr) || [];
    }
  }

  async getHolidayCount(year: number, isFiscal: boolean = false): Promise<HolidayCount> {
    const holidays = await this.getHolidays(year, isFiscal);
    const weekendDays = this.countWeekendDays(year, isFiscal);
    const publicHolidays = holidays.filter(h => !h.name.includes('振替')).length;
    const compensationHolidays = holidays.filter(h => h.name.includes('振替')).length;
    
    // 土日と重複しない祝日のみを計算
    const nonWeekendHolidays = this.countNonWeekendHolidays(year, isFiscal, holidays);
    
    return {
      totalHolidays: weekendDays + nonWeekendHolidays,
      weekendDays,
      publicHolidays,
      compensationHolidays
    };
  }

  private countNonWeekendHolidays(_year: number, _isFiscal: boolean, holidays: Holiday[]): number {
    let count = 0;
    
    for (const holiday of holidays) {
      const dayOfWeek = holiday.date.getDay();
      // 土日以外の祝日のみカウント
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
    }
    
    return count;
  }

  private countWeekendDays(year: number, isFiscal: boolean = false): number {
    let weekendCount = 0;
    let startDate: Date;
    let endDate: Date;
    
    if (isFiscal) {
      // 年度：4月1日 - 翌年3月31日
      startDate = new Date(year, 3, 1); // 4月1日
      endDate = new Date(year + 1, 2, 31); // 翌年3月31日
    } else {
      // 暦年：1月1日 - 12月31日
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31);
    }
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendCount++;
      }
    }
    
    return weekendCount;
  }

  async isHoliday(date: Date): Promise<boolean> {
    const year = date.getFullYear();
    const holidays = await this.getHolidays(year);
    
    return holidays.some(holiday => 
      holiday.date.getTime() === date.getTime()
    );
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const holidayService = new HolidayService();
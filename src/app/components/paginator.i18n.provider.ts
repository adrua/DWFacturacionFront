import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

export function getPaginatorIntl(translate: TranslateService) {
    const paginatorIntl = new MatPaginatorIntl();
    
    translate.get("PAGINATOR.itemsPerPageLabel").subscribe((res: string) => {
        paginatorIntl.itemsPerPageLabel = res;
    });

    translate.get("PAGINATOR.nextPageLabel").subscribe((res: string) => {
        paginatorIntl.nextPageLabel = res;
    });

    translate.get("PAGINATOR.previousPageLabel").subscribe((res: string) => {
        paginatorIntl.previousPageLabel = res;
    });

    translate.get("PAGINATOR.firstPageLabel").subscribe((res: string) => {
        paginatorIntl.firstPageLabel = res;
    });

    translate.get("PAGINATOR.lastPageLabel").subscribe((res: string) => {
        paginatorIntl.lastPageLabel = res;
    });

    translate.get("PAGINATOR.getRangeLabel").subscribe((res: string) => {
        paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
            if (length == 0 || pageSize == 0) { return `0 ${res} ${length}`; }
            
            length = Math.max(length, 0);
          
            const startIndex = page * pageSize;
          
            // If the start index exceeds the list length, do not try and fix the end index to the end.
            const endIndex = startIndex < length ?
                Math.min(startIndex + pageSize, length) :
                startIndex + pageSize;
          
            return `${startIndex + 1} - ${endIndex} ${res} ${length}`;
          };
    });

    return paginatorIntl;
}

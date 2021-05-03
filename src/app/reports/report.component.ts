import { ListService, PagedResultDto } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, Confirmation } from '@abp/ng.theme.shared';
import { DepartmentDto, DepartmentService } from '@proxy/departments';
import { ReportDto, ReportRequestdto, ReportService } from '@proxy/reports';

@Component({
  selector: 'report-management',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  providers: [ListService],
})
export class ReportComponent implements OnInit {
  report = { items: [], totalCount: 0 } as PagedResultDto<ReportDto>;
  loadingIndicator = true;
  form: FormGroup;
  request : ReportRequestdto;
  selectedDepartment: DepartmentDto;

  isModalOpen = false;

  constructor(
    public readonly list: ListService,   
    private reportService: ReportService
  ) {
  }

  ngOnInit() {
    this.request = { maxResultCount : 10};
    this.setPage({ offset: 0 });
  }
  
  setPage(pageInfo) {
    this.request.skipCount = pageInfo.offset;
    const departmentStreamCreator = () => this.reportService.getReport(this.request);
    this.list.hookToQuery(departmentStreamCreator).subscribe((response: PagedResultDto<ReportDto>) => {
      this.report = response;
      this.loadingIndicator = false;
    });
  }
    
  download(id){

  }  
  
  downloadFile(id){

  }
}

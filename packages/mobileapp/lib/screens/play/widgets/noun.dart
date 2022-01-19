import 'package:flutter/widgets.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class Noun extends StatelessWidget {
  const Noun({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 300.w,
      child: Image.asset('assets/img/loading-skull-noun.gif'),
    );
  }
}
